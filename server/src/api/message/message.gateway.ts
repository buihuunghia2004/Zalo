import { OnEvent } from '@nestjs/event-emitter';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { In, Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitterKey } from '@/constants/event-emitter.constant';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtPayloadType } from '../auth/types/jwt-payload.type';
import { MemberEntity } from './entities/member.entity';
import { Uuid } from '@/common/types/common.type';
import { CacheKey } from '@/constants/cache.constant';
import { createCacheKey } from '@/utils/cache.util';
import { ChatRoomService } from '../chat-room/chat-room.service';
import { SocketEmitKey } from '@/constants/socket-emit.constanct';

export interface UnReceiMsgData {
  count: number,
  lastMsg: string
}
const SOCKET_ROOM = 'socket_room:'
const CHAT_ROOM = 'chat_room:'
@Injectable()
@WebSocketGateway({ namespace: '/message' })
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
    private readonly chatRoomService: ChatRoomService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {   
    try {
      const accessToken = this.extractTokenFromHeader(client);      
      const {id}: JwtPayloadType =
      await this.authService.verifyAccessToken(accessToken);      
      
      //caching lại userId vừa connect (online) và clientId bằng userId
      await this.cacheManager.set(createCacheKey(CacheKey.MSG_SOCKET_CONNECT, client.id), id);
      await this.cacheManager.set(createCacheKey(CacheKey.USER_CLIENT, id), client.id);
 
      //client join tất cả các phòng chat
      const roomIds = await this.chatRoomService.getAllRoomIdsByUserId(id)
      
      roomIds.forEach(id => {
        client.join(SOCKET_ROOM + id)
      });
      
      //xử lý khi client connect
      this.loadMsgWhenConnect(id, client.id)
      console.log(`MSG-SOCKET-CONNECT:: ${client.id}`);
    } catch (error) {
      
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log(`MSG-SOCKET-DISCONNECT:: ${client.id}`);
    //lấy userId từ clientSocetId
    const userId = await this.cacheManager.get(createCacheKey(CacheKey.MSG_SOCKET_CONNECT, client.id)) as Uuid;
    
    //set thời gian truy cập lần cuối cho user
    await this.userRepository.update({id: userId}, {lastOnline: new Date()})
    
    //dọn dẹp dữ liệu trong cache online và join_room
    await this.cacheManager.del(createCacheKey(CacheKey.MSG_SOCKET_CONNECT, client.id));
    await this.cacheManager.del(createCacheKey(CacheKey.JOIN_ROOM, client.id)); 
    await this.cacheManager.del(createCacheKey(CacheKey.USER_CLIENT, userId)); 

    
    // const roomIds = await this.chatRoomService.getAllRoomIdsByUserId(userId) as string[]
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string},
    @ConnectedSocket() client: Socket,
  ) {        
    //vào 1 phòng chat
    client.join(CHAT_ROOM + data.roomId);

    const userId: string = await this.cacheManager.get(createCacheKey(CacheKey.MSG_SOCKET_CONNECT, client.id));    
    const member = await this.memberRepository.findOne({
      where:{roomId: data.roomId as Uuid, userId: userId as Uuid},
      select:['id']
    })    
    await this.cacheManager.set(createCacheKey(CacheKey.JOIN_ROOM, client.id), member.id);
    
    //xóa các tin nhắn chờ sau khi đã đọc
    let unReceiveMsgRooms = await this.cacheManager.get(createCacheKey(CacheKey.UNRECEIVE_MSG, userId))    
    if (unReceiveMsgRooms) {
      delete unReceiveMsgRooms[data.roomId]
      await this.cacheManager.set(createCacheKey(CacheKey.UNRECEIVE_MSG, userId),unReceiveMsgRooms)    
    }
    //set lại thời gian xem tin nhắn
    await this.memberRepository.update({id: member.id}, {msgVTime: new Date()})
    
    console.log(`client ${client.id} has join room ${data.roomId}`);
  }

  @SubscribeMessage('leave-room')
  async handleOutRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,

  ) {
    //rời phòng chat
    client.leave(CHAT_ROOM + data.roomId);

    const memberId = await this.cacheManager.get(createCacheKey(CacheKey.JOIN_ROOM, client.id))

    //set thời gian rời phòng cho member
    await this.memberRepository.update({id: memberId as Uuid},{msgVTime: new Date()})
    
    await this.cacheManager.del(createCacheKey(CacheKey.JOIN_ROOM, client.id)); 
    console.log(`client ${client.id} has leave room ${data.roomId}`);
  }

  @SubscribeMessage('writing-message')
  async handleClientMessage(
    @MessageBody() data: {roomId: string, status: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const memberId = await this.cacheManager.get(createCacheKey(CacheKey.JOIN_ROOM, client.id))    
    const isWriting = await this.cacheManager.get('writing-msg:'+data.roomId)
    if (data.status && !isWriting) {
      await this.cacheManager.set('writing-msg:'+data.roomId,memberId)
      this.server.to(CHAT_ROOM + data.roomId).emit(SocketEmitKey.WRITING_MESSAGE, {memberId, status: data.status})
    }else if(!data.status && isWriting){
      await this.cacheManager.del('writing-msg:'+data.roomId)
      this.server.to(CHAT_ROOM + data.roomId).emit(SocketEmitKey.WRITING_MESSAGE, {memberId, status: data.status})
    }
    console.log(`member ${memberId} is writing message in room ${data.roomId}`);
  }

  @OnEvent(EventEmitterKey.NEW_MESSAGE)
  async newMessage(data: any) {
    try {
      const { onlineMembers, offlineMembers, msgData, roomId, createdAt } = data;          

      console.log('r',roomId);
      
      //gửi đến các user đang online
      this.server.to(SOCKET_ROOM + roomId).emit(SocketEmitKey.NEW_MESSAGE,msgData)

      //lưu trạng thái đã nhận tin nhắn cho các user đang online
      if (onlineMembers.length > 0) {
        await this.memberRepository.update(
          {id: In(onlineMembers.map(m => m.id))},
          {msgRTime: new Date(createdAt)}
        )
      }

      /**
       * Khi user offline
       * caching roomId vào danh sách phòng có tin nhắn mới
       * key:createCacheKey(CacheKey.UNRECEIVE_MSG, userId)
       * value: {
       *  xxx-yyy:{
       *    lastMsg: string
       *    count: number
       *  }
       * }
       * trong đó xxx-yyy là roomId
       */

      //tạo danh sách keys member offline chưa nhận tin nhắn bằng userId
      const mKeys: string[] = offlineMembers.map(m => createCacheKey(CacheKey.UNRECEIVE_MSG, m.userId))    
      //lấy danh sách members chưa nhận tin nhắn lần trước
      let mOldOffData = await this.cacheManager.store.mget(...mKeys)
      //Tạo danh sách members chưa nhận tin nhắn mới
      const mNewOffData: Array<[string, any]> = mOldOffData.map((m, index)=> {
        const value = {}
        value[roomId] = {
          lastMsg: msgData,
          count: (m && m[roomId]) ? (m[roomId].count + 1) : 1
        }      
        return [
          mKeys[index],
          value
        ]
      })
      
      //caching lại danh sách members chưa nhận tin nhắn
      await this.cacheManager.store.mset(mNewOffData)
    } catch (error) {
      
    }
  }

  async loadMsgWhenConnect(userId: string,  clientSocketId: string) {    
    //Lấy danh sách các phòng có tin nhắn mới
    const unReceiveMsgRooms = await this.cacheManager.get(createCacheKey(CacheKey.UNRECEIVE_MSG, userId))    
    if (unReceiveMsgRooms) {
      //Emit socket về client
      this.server.to(clientSocketId).emit(
        SocketEmitKey.LOAD_MORE_MSGS_WHEN_CONNECT,
        unReceiveMsgRooms
      )

      //Emit socket thông báo đã nhận tin nhắn đến các phòng
      const roomIds = Object.keys(unReceiveMsgRooms)
      await Promise.all(roomIds.map(async (id) => {
        const member = await this.memberRepository.findOne({
          where: {roomId: id as Uuid, userId: userId as Uuid}
        })
        
        this.server.to(CHAT_ROOM + id).emit(SocketEmitKey.RECEIVED_MSG,{
          roomId: id,
          memberId: member.id,
          receivedAt: new Date()
        })
      })) 
    }

    //cập nhật thời gian nhận tin nhắn cho tất cả member của user này
    await this.memberRepository.update({userId: userId as Uuid},{msgRTime: new Date()})
  }

  private  extractTokenFromHeader(request: Socket): string | undefined {
    const accessToken = 
      request.handshake.auth.token || request.handshake.headers.authorization
    const [type, token] = accessToken.trim()?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
 
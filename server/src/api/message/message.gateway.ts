import { OnEvent } from '@nestjs/event-emitter';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  WsException,
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
import { createEventKey } from '@/utils/socket.util';
import { EventKey } from '@/constants/event.constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { JwtPayloadType } from '../auth/types/jwt-payload.type';
import { MemberEntity } from './entities/member.entity';
import { MessageEntity } from './entities/message.entity';
import { Uuid } from '@/common/types/common.type';
import { log } from 'console';
import { CacheKey } from '@/constants/cache.constant';
import { createCacheKey } from '@/utils/cache.util';
import { ChatRoomService } from '../chat-room/chat-room.service';

export interface UnReceiMsgData {
  count: number,
  lastMsg: string
}
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
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {   
    const accessToken = this.extractTokenFromHeader(client);
    const {id}: JwtPayloadType =
      await this.authService.verifyAccessToken(accessToken);
    
    //caching lại userId bằng clientId  
    await this.cacheManager.set(createCacheKey(CacheKey.EVENT_CONNECT, client.id), id);

    //client join tất cả các phòng chat
    const roomIds = await this.chatRoomService.getAllRoomIdsByUserId(id)
    client.join(roomIds)

    //xử lý khi client connect
    this.newConnect(id)
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('socket message disConnect', client.id);
    //lấy userId từ clientSocetId
    const userId = await this.cacheManager.get(createCacheKey(CacheKey.EVENT_CONNECT, client.id)) as Uuid;

    //xóa userId ra khỏi cache 
    await this.cacheManager.del(createCacheKey(CacheKey.EVENT_CONNECT, client.id));

    //set thời gian truy cập lần cuối cho user
    await this.userRepository.update(userId, {lastOnline: new Date()})
    // const roomIds = await this.chatRoomService.getAllRoomIdsByUserId(userId) as string[]
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string},
    @ConnectedSocket() client: Socket,
  ) {    
    client.join(data.roomId);
    // await this.cacheManager.del(`unrcv_message:${data.userId}`);
  }
7
  @SubscribeMessage('out-room')
  async handleOutRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    //rời phòng trong socket
    client.leave(data.roomId);

    //set thời gian rời phòng cho member

  }

  @SubscribeMessage('writing-message')
  async handleClientMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.broadcast.emit(
      createEventKey(EventKey.WRITING_MESSAGE, data.roomId),
      { status: data.status },
    );
  }
  
  @SubscribeMessage('received-message')
  async handleReceivedMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    await this.receivedMessage(data)
  }

  @OnEvent('received-message')
  async handleReceivedMessageAfterOnline(data: any){    
    await this.receivedMessage(data)
  }

  @OnEvent(EventEmitterKey.NEW_MESSAGE)
  async newMessage(data: any) {
    const { members, roomId, createdAt } = data;

    //lọc danh sách member online và offline
    const userIdKeys = members.map(m => createCacheKey(CacheKey.EVENT_CONNECT,m.userId))
    const userCacheIds = await this.cacheManager.store.mget(...userIdKeys)
    let onlineMembers = []
    let offineMembers = []
    userCacheIds.forEach((id, index) => {
      if (id) {
        //member.msgRTime = new Date(createdAt).getMilliseconds()
        onlineMembers.push(members[index])
      }else{
        offineMembers.push(members[index])
      }
    });

    //gửi đến các user đang online
    this.server.to(roomId).emit(data)
    // onlineMembers.forEach(member => {
    //   this.server.emit(
    //     createEventKey(EventKey.NEW_MESSAGE, member.userId),
    //     data
    //   );
    // });

    //lưu trạng thái đã nhận tin nhắn cho các user đang online
    await this.memberRepository.update(
      {id: In(onlineMembers.map(m => m.id))},
      {msgRTime: new Date(createdAt).getMilliseconds()}
    )

    /**
     * caching roomId vào danh sách phòng có tin nhắn mới
     * key:createCacheKey(CacheKey.UNRECEIVE_MSG, userId, roomId)
     * value: {
     *    roomId: string
     *   lastMsg: string
     *   count: number
     * }
     */
    const mKeys: string[] = offineMembers.map(m => createCacheKey(CacheKey.UNRECEIVE_MSG, m.userId, roomId))
    let mOldOffData = await this.cacheManager.store.mget(...mKeys) as UnReceiMsgData[]
    const mNewOffData: Array<[string, UnReceiMsgData]> = mOldOffData.map((m, index)=> {
      return [
        createCacheKey(CacheKey.UNRECEIVE_MSG, offineMembers[index].userId, roomId),
        {

          lastMsg: data.content,
          count: m ? m.count + 1 : 1
        }
      ]
    })
    await this.cacheManager.store.mset(mNewOffData)
  }

  async newConnect(userId: string) {
    const rawRooms = await this.cacheManager.get(`unrcv_message:${userId}`);
    if (rawRooms) {
      const roomIds = Object.keys(rawRooms);
      for (const roomId of roomIds) {
        const messages = await this.messageRepository
          .createQueryBuilder('m')
          .where('m.roomId = :roomId', { roomId })
          .andWhere('m.createdAt >= :createdAt', {
            createdAt: rawRooms[roomId],
          })
          .getMany();
          
        for (const message of messages) {
          const sender = await this.messageRepository
            .createQueryBuilder('msg')
            .leftJoin('msg.sender','sender')
            .addSelect('sender.id')
            .leftJoin('sender.user','user')
            .addSelect('user.id')
            .where('msg.id = :msgId',{msgId: message.id})
            .getOne()            
          this.server.emit(
            createEventKey(EventKey.NEW_MESSAGE, userId),
            {
              ...message,
              sender:sender.sender
            },
          );
        }
      }
    }
  }

  private  extractTokenFromHeader(request: Socket): string | undefined {
    const accessToken = 
      request.handshake.auth.token || request.handshake.headers.authorization
    const [type, token] = accessToken.trim()?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async receivedMessage({msgId, memberId, senderId}){
    await this.memberRepository.update(memberId, {receivedMsgId: msgId})

    const receivedMemberList = await this.memberRepository
      .createQueryBuilder('mem')
      .select([
        'mem.id','mem.receivedMsgId','mem.viewedMsgId'
      ])
      .where('mem.receivedMsgId = :receivedMsgId',{receivedMsgId: msgId})
      .getMany()
      
    this.server.emit(`a:${senderId}:b`,receivedMemberList)
  }
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
 
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
import { Repository } from 'typeorm';
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

@Injectable()
@WebSocketGateway({ namespace: '/message' })
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
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
    // try {
    //   const accessToken = this.extractTokenFromHeader(client);
    //   const user: JwtPayloadType =
    //     await this.authService.verifyAccessToken(accessToken);
    //   this.cacheManager.set(`connected:${user.id}`, user.id);
    // } catch (error) {
    //   this.server.emit('error', 'hihi');
    // }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {

  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string, userId: string },
    @ConnectedSocket() client: Socket,
  ) {    
    client.join(data.roomId);
    console.log('cc',data.userId);
    
    await this.cacheManager.del(`unrcv_message:${data.userId}`);
  }

  @SubscribeMessage('out-room')
  async handleOutRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {    
    client.leave(data.roomId);
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
    const {msgId, memberId, senderId} = data
    //update received_msg_id = msgId cho member có roomId và userId
    await this.memberRepository.update(memberId, {receivedMsgId: msgId})

    // if (true) {
      const receivedMemberList = await this.memberRepository.find({
        where:{
          receivedMsgId: msgId
        },
        select:['id','createdAt','receivedMsgId','viewedMsgId']
      })      
      
      this.server.emit(`a:${senderId}:b`,receivedMemberList)
    // }
  }

  @OnEvent(EventEmitterKey.NEW_MESSAGE)
  async newMessage(data: any) {
    const { members, roomId } = data;
    //check clients online or offline
    let onlineClientIds = []
    let offineClientIds = []
    await Promise.all(await members.map( async (member) => {
      const userId = await this.cacheManager.get(`connected:${member.userId}`)
      if (userId) {
        onlineClientIds.push(member.userId)
      }else{
        offineClientIds.push(member.userId)
      }
    }))

    console.log('on',onlineClientIds);
    console.log('of',offineClientIds);
    

    //gửi đến các user đang online
    onlineClientIds.forEach(id => {
      this.server.emit(
        createEventKey(EventKey.NEW_MESSAGE, id),
        data,
      );
    });

    //lưu lại các user đang offline
    await Promise.all(
      offineClientIds.map(async (id) => {
        const tmp = await this.cacheManager.get(`unrcv_message:${id}`)
        let roomIds = tmp || {}
        if (!roomIds[`${roomId}`]) {
          roomIds[`${roomId}`] = data.createdAt
        }
        await this.cacheManager.set(`unrcv_message:${id}`,roomIds)
      })
    )

  }

  @OnEvent('aaa')
  async aaa(data: any) {
    const {userId} = data
    const rawRooms = await this.cacheManager.get(`unrcv_message:${userId}`);
    if (rawRooms) {
      const roomIds = Object.keys(rawRooms);
      for (const roomId of roomIds) {
        const messages = await this.messageRepository
          .createQueryBuilder('m')
          .where('m.roomId = :roomId', { roomId })
          .andWhere('m.createdAt > :createdAt', {
            createdAt: rawRooms[roomId],
          })
          .getMany();

        console.log('mmm',messages.length);
          
        for (const message of messages) {
          this.server.emit(
            createEventKey(EventKey.NEW_MESSAGE, userId),
            message,
          );
        }
      }
    }
  }
  private extractTokenFromHeader(request: Socket): string | undefined {
    const accessToken = request.handshake.auth.token || request.handshake.headers.authorization
    const [type, token] = accessToken.trim()?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

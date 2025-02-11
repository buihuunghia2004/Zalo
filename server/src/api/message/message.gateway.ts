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
    console.log('socket message connect', client.id);
    
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
    console.log('socket message disConnect', client.id);
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string, userId: string },
    @ConnectedSocket() client: Socket,
  ) {    
    client.join(data.roomId);    
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
    await this.receivedMessage(data)
  }

  @OnEvent('received-message')
  async handleReceivedMessageAfterOnline(data: any){    
    await this.receivedMessage(data)
  }

  @OnEvent(EventEmitterKey.NEW_MESSAGE)
  async newMessage(data: any) {
    const { members, roomId, createdAt } = data;
    //check members online or offline
    let onlineMembers = []
    let offineMembers = []

    await Promise.all(await members.map( async (member) => {
      const userId = await this.cacheManager.get(`connected:${member.userId}`)
      if (userId) {
        member.msgRTime = new Date(createdAt).getMilliseconds()
        onlineMembers.push(member)
      }else{
        offineMembers.push(member)
      }
    }))


    //gửi đến các user đang online
    onlineMembers.forEach(member => {
      this.server.emit(
        createEventKey(EventKey.NEW_MESSAGE, member.userId),
        data,
      );
    });

    //lưu trạng thái đã nhận tin nhắn cho các user đang online
    await this.memberRepository.update(
      {id: In(onlineMembers.map(m => m.id))},
      {msgRTime: new Date(createdAt).getMilliseconds()}
    )

    //lưu lại các user đang offline
    await Promise.all(
      offineMembers.map(async (member) => {
        const tmp = await this.cacheManager.get(`unrcv_message:${member.userId}`)
        let roomIds = tmp || {}
        if (!roomIds[`${roomId}`]) {
          roomIds[`${roomId}`] = data.createdAt
        }
        await this.cacheManager.set(`unrcv_message:${member.userId}`,roomIds)
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
    const accessToken = request.handshake.auth.token || request.handshake.headers.authorization
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

  private changeMsgStatusWhenUserOnline = async ({userId}) => {
   
    //Get a list of room's ids where the user has not received messages
    const roomIds = await this.cacheManager.get(`unrcv_message:${userId}`)

    
  }
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
 
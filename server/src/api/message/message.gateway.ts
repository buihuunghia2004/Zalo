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

  async handleDisconnect(@ConnectedSocket() client: Socket) {}

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {    
    client.join(data.roomId);
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

  @OnEvent(EventEmitterKey.NEW_MESSAGE)
  async newMessage(data: any) {
    const { members, roomId } = data;

    //cho những user đang trong room
    this.server.to(roomId).emit(
      'new_message_to_room',
      data
    );

    //cho all user
    members.forEach(member => {
      this.server.emit(
        createEventKey(EventKey.NEW_MESSAGE, member.userId),
        data,
      );
    });

    //check clients online or offline
    // let onlineClients = []
    // let offineClients = []

    // await Promise.all(await members.map( async (member) => {
    //   const userId = await this.cacheManager.get(`connected:${member.userId}`)
    //   if (userId) {
    //     onlineClients.push(member.userId)
    //   }else{
    //     offineClients.push(member.userId)
    //   }
    // }))

    // if (onlineClients.length > 0) {
    //   this.server.emit(
    //     createEventKey(EventKey.NEW_MESSAGE, member.userId),
    //     data
    //   )
    // }

    //handle here...

    //hadle online clients...

    //hadle offine clients...
    
  }
  private extractTokenFromHeader(request: Socket): string | undefined {
    const accessToken = request.handshake.auth.token || request.handshake.headers.authorization
    const [type, token] = accessToken.trim()?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

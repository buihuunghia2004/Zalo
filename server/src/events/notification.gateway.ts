import { EventEmitterKey } from '@/constants/event-emitter.constant';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UseGuards } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Cache } from 'cache-manager';
import { AuthService } from '@/api/auth/auth.service';
import { JwtPayloadType } from '@/api/auth/types/jwt-payload.type';
import { createEventKey } from '@/utils/socket.util';
import { EventKey } from '@/constants/event.constants';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '@/api/message/entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173', // Địa chỉ ReactJS hoặc client của bạn
    credentials: true,
    allowedHeaders: ['Custom-Header', 'Authorization'], // Cho phép gửi cookie nếu cần
  },
}) // Không namespace để áp dụng toàn cục
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly authService: AuthService,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private eventEmitter: EventEmitter2,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const accessToken = this.extractTokenFromHeader(client);
      const user: JwtPayloadType =
      await this.authService.verifyAccessToken(accessToken);
      await this.cacheManager.set(`connected:${user.id}`, user.id);
      this.eventEmitter.emit('aaa',{userId: user.id})
      // this.eventEmitter.emit('xxx',{userId: user.id})
      console.log('socket connect', client.id);
      
    } catch (error) {
      this.server.emit('error', 'hihi');
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      const accessToken = this.extractTokenFromHeader(client);
      const user: JwtPayloadType =
        await this.authService.verifyAccessToken(accessToken);
      this.cacheManager.del(`connected:${user.id}`);
      console.log('socket dis connect', client.id);

    } catch (error) {
      this.server.emit('error', 'hihi');
    }
  }

  @OnEvent(EventEmitterKey.SENT_REQUEST_ADD_FRIEND)
  sendNotificationSentRequestAddFriend(data: any) {
    const { to, payload } = data;
    this.server.emit(to, payload);
  }

  @OnEvent(EventEmitterKey.HANDLE_REQUEST_ADD_FRIEND)
  handleNotificationSentRequestAddFriend(data: any) {
    const { to, payload } = data;
    this.server.emit(to, payload);
  }

  @SubscribeMessage('requestNotification')
  handleRequestNotification(client: any, payload: any) {
    client.emit('notification', {
      message: 'Your notification request is processed.',
    });
  }

  private extractTokenFromHeader(request: Socket): string | undefined {
    const accessToken =
      request.handshake.auth.token || request.handshake.headers.authorization;
    const [type, token] = accessToken.trim()?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

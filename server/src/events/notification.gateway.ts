import { EventEmitterKey } from '@/constants/event-emitter.constant';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
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
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '@/api/message/entities/message.entity';
import { Repository } from 'typeorm';
import { JwtPayloadType } from '@/api/auth/types/jwt-payload.type';
import { createCacheKey } from '@/utils/cache.util';
import { CacheKey } from '@/constants/cache.constant';
import { SocketEmitKey } from '@/constants/socket-emit.constanct';

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
      const {id}: JwtPayloadType =
      await this.authService.verifyAccessToken(accessToken);
      await this.cacheManager.set(createCacheKey(CacheKey.NOTI_SOCKET_CONNECT, client.id), id);
      await this.cacheManager.set(id, client.id);

      console.log(`client ${client.id} connected notification socket`);
    } catch (error) {
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      const userId: string = await this.cacheManager.get(createCacheKey(CacheKey.NOTI_SOCKET_CONNECT, client.id));
      await this.cacheManager.del(createCacheKey(CacheKey.NOTI_SOCKET_CONNECT, client.id));
      await this.cacheManager.del(userId)

      console.log(`client ${client.id} disconnected notification socket`);
    } catch (error) {
    }
  }

  @OnEvent(EventEmitterKey.SENT_REQUEST_ADD_FRIEND)
  async sendNotificationSentRequestAddFriend({receiverId, data}) {    
    const clientSocketId: string = await this.cacheManager.get(receiverId)    
    this.server.to(clientSocketId).emit(SocketEmitKey.RECEIVED_RELATION_REQ, data);
  }

  @OnEvent(EventEmitterKey.ACCEPT_RELATION_REQ)
  async handleNotificationSentRequestAddFriend(requesterId: string, data: any) {
    const clientSocketId: string = await this.cacheManager.get(requesterId)
    this.server.to(clientSocketId).emit(SocketEmitKey.ACCEPT_RELATION_REQ, data);
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

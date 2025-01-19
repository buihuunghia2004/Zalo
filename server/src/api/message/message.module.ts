import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { ChatRoomEntity } from './entities/chat-room.entity';
import { MemberEntity } from './entities/member.entity';
import { MessageEntity } from './entities/message.entity';
import { LoggerMiddleware } from 'src/middleware/guard-socket.middleware';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports:[
    AuthModule,
    CloudinaryModule,
    TypeOrmModule.forFeature([
      UserEntity,
      ChatRoomEntity,
      MemberEntity, 
      MessageEntity,
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
})
export class MessageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
  }
}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { ChatRoomEntity } from '../chat-room/entities/chat-room.entity';
import { MemberEntity } from './entities/member.entity';
import { MessageEntity } from './entities/message.entity';
import { LoggerMiddleware } from 'src/middleware/guard-socket.middleware';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ChatRoomModule } from '../chat-room/chat-room.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueName, QueuePrefix } from '@/constants/job.constant';

@Module({
  imports:[
    AuthModule,
    CloudinaryModule,
    ChatRoomModule,
    TypeOrmModule.forFeature([
      UserEntity,
      ChatRoomEntity,
      MemberEntity, 
      MessageEntity,
    ]),
    BullModule.registerQueue({
          name: QueueName.EMAIL,
          prefix: QueuePrefix.AUTH,
          streams: {
            events: {
              maxLen: 1000,
            },
          },
        }),
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

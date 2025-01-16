import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { BullModule } from '@nestjs/bullmq';
import { QueueName, QueuePrefix } from '@/constants/job.constant';
import { AuthModule } from '@/api/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from '@/api/message/entities/message.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      MessageEntity
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
    AuthModule,
  ],
  providers: [
    NotificationGateway,
  ],
})
export class EventsModule {}

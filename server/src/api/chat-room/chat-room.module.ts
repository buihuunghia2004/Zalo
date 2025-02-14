import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomController } from './chat-room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomEntity } from './entities/chat-room.entity';
import { MemberEntity } from '../message/entities/member.entity';
import { MessageEntity } from '../message/entities/message.entity';
@Module({
  imports:[
    TypeOrmModule.forFeature([
      ChatRoomEntity,
      MemberEntity,
      MessageEntity
    ])
  ],
  controllers: [ChatRoomController],
  providers: [ChatRoomService],
  exports: [ChatRoomService]
})
export class ChatRoomModule {}

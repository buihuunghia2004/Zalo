import { Module } from '@nestjs/common';
import { RelationService } from './relation.service';
import { RelationController } from './relation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { RelationEntity } from './entities/relation.entity';
import { ChatRoomService } from '../chat-room/chat-room.service';
import { ChatRoomModule } from '../chat-room/chat-room.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([RelationEntity, UserEntity]),
    ChatRoomModule, 
  ],
  controllers: [RelationController],
  providers: [RelationService], 
  exports: [RelationService],
})
export class RelationModule {}


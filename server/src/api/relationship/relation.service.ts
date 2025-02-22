import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleRequestToAddFriendReqDto } from './dto/handle-req.req.dto';
import { RelationEntity } from './entities/relation.entity';
import { RelationResDto } from './dto/list-relation.res.dto';
import { UserEntity } from '../user/entities/user.entity';
import { Uuid } from '@/common/types/common.type';
import { plainToInstance } from 'class-transformer';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createEventKey } from '@/utils/socket.util';
import { EventKey } from '@/constants/event.constants';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { ErrorCode } from '@/constants/error-code.constant';
import { EventEmitterKey } from '@/constants/event-emitter.constant';
import { InviterType, RelationAction, RelationStatus } from '@/constants/entity-enum/relation.enum';
import { ChatRoomService } from '../chat-room/chat-room.service';

@Injectable()
export class RelationService {
  constructor(
    @InjectRepository(RelationEntity)
    private readonly relationRepository: Repository<RelationEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private eventEmitter: EventEmitter2,
    private chatRoomService: ChatRoomService
  ){}

  async sendRequest(senderId: Uuid, receiverId: Uuid, ): Promise<RelationResDto>{    
    if (senderId == receiverId) {
      throw new ValidationException()
    }
    await this.userRepository.findOneByOrFail({id: receiverId})
    const relationExists = await this.relationRepository.findOne({
      where:[
        {requesterId: senderId, handlerId: receiverId},
        {requesterId: receiverId, handlerId: senderId},
      ]
    })
    if (relationExists) {
      throw new ValidationException(ErrorCode.RELATION_E001)
    }

    //create new relation
    const newRelation = new RelationEntity({
      requesterId: senderId,
      handlerId: receiverId,
      status: RelationStatus.PENDING,
      createdBy: SYSTEM_USER_ID,
      updatedBy: SYSTEM_USER_ID
    })    
    await this.relationRepository.save(newRelation)    
    
    //sent notify to handler
    this.eventEmitter.emit(
      EventEmitterKey.SENT_REQUEST_ADD_FRIEND,
      {
        receiverId,
        data:{
          user: newRelation.requesterId
        }
      }
    )

    return plainToInstance(RelationResDto, newRelation)
  }

  async handleRequest(dto: HandleRequestToAddFriendReqDto, myId: Uuid): Promise<RelationResDto>{
    //check relation exists
    const relation = await this.relationRepository.findOneBy({
      id: dto.relationId,
      status: RelationStatus.PENDING
    })
    
    if (!relation) {
      throw new ValidationException(ErrorCode.RELATION_E002)
    }
    
    if (
      dto.action === RelationAction.DECLINE ||  //Từ chối kết bạn
      dto.action === RelationAction.REVOKE      //Thu hồi lời mời
    ) {      
      await this.relationRepository.remove(relation)
      relation.status = RelationStatus.NOTTHING
    }else{
      relation.status = RelationStatus.FRIEND     //Đồng ý kết bạn
      await this.relationRepository.save(relation)

      //check chat room exists, if not, create one
      const chatRoom = await this.chatRoomService.getPersonalRoomFromUsers(relation.requesterId, myId);
      if (!chatRoom){
        await this.chatRoomService.createPersonalRoom(relation.requesterId, myId);
      }
      
      //gửi thống báo đến cho người gửi yêu cầu
      this.eventEmitter.emit(
        EventEmitterKey.ACCEPT_RELATION_REQ,
        {
          relationId: relation.id
        }
      )
    }

    return plainToInstance(RelationResDto, {...relation, createdBy: SYSTEM_USER_ID, updatedBy: SYSTEM_USER_ID})
  }

  async getAllRelations(currentUserId: Uuid, status: RelationStatus) : Promise<any[]>{        
    const query = this.relationRepository
      .createQueryBuilder('relation')
      .leftJoinAndSelect('relation.requester', 'requester')
      .leftJoinAndSelect('relation.handler', 'handler')
      // .where(
      //   '(requester.id = :currentUserId) OR (handler.id = :currentUserId)',
      //   { currentUserId }
      // )
      .where(
        '((requester.id = :currentUserId) OR (handler.id = :currentUserId))',
        { currentUserId }
      )

    if (status) {      
      query.andWhere('relation.status = :status',{status})
    }
    query.select([
      'relation.id',
      'relation.status',
      'relation.createdAt',
      'requester.id',
      'requester.username',
      'requester.avatarUrl',
      'handler.id',
      'handler.username',
      'handler.avatarUrl',
    ])

    const relations = await query.getMany()        

    const result = relations.map(item => {
      return {
        id: item.id,
        status: item.status,
        createdAt: item.createdAt,
        user: item.requester.id == currentUserId ? item.handler : item.requester,
        inviter: item.requester.id == currentUserId ? InviterType.SELF : InviterType.OTHER,
      }
    })
    
    return result
  }

  async deleteRelation(id: Uuid): Promise<any>{
    await this.relationRepository.delete({id})
  }
}
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleRequestToAddFriendReqDto } from './dto/handle-req.req.dto';
import { RelationEntity } from './entities/relation.entity';
import { RelationResDto } from './dto/list-relation.res.dto';
import { UserEntity } from '../user/entities/user.entity';
import { Uuid } from '@/common/types/common.type';
import { Who } from '@/constants/entity.enum';
import { plainToInstance } from 'class-transformer';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createEventKey } from '@/utils/socket.util';
import { EventKey } from '@/constants/event.constants';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { ErrorCode } from '@/constants/error-code.constant';
import { EventEmitterKey } from '@/constants/event-emitter.constant';
import { InviterType, RelationAction, RelationStatus } from '@/constants/entity-enum/relation.enum';

@Injectable()
export class RelationService {
  constructor(
    @InjectRepository(RelationEntity)
    private readonly relationRepository: Repository<RelationEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private eventEmitter: EventEmitter2
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
        to: createEventKey(EventKey.NOTIFY_REQUEST_ADD_FRIEND_SENT, receiverId.toString()),
        payload:{
          message:'ok',
          contain:'You have a request add friend.',
          from:senderId
        }
      }
    )

    return plainToInstance(RelationResDto, newRelation)
  }

  async handleRequest(dto: HandleRequestToAddFriendReqDto): Promise<RelationResDto>{
    //check relation exists
    const relation = await this.relationRepository.findOneBy({
      id: dto.relationId,
      status: RelationStatus.PENDING
    })
    
    if (!relation) {
      throw new ValidationException(ErrorCode.RELATION_E002)
    }

    if (
      dto.action === RelationAction.DECLINE ||
      dto.action === RelationAction.REVOKE
    ) {
      await this.relationRepository.remove(relation)
      relation.status = RelationStatus.NOTTHING
    }else{
      relation.status = RelationStatus.FRIEND
      await this.relationRepository.save(relation)

      //sent notify to requester
      this.eventEmitter.emit(
        EventEmitterKey.HANDLE_REQUEST_ADD_FRIEND,
        {
          to: createEventKey(EventKey.NOTIFY_REQUEST_ADD_FRIEND_SENT,relation.requesterId.toString()),
          payload:{
            message:'ok',
            contain:'You have a request add friend.',
            from:relation.handlerId
          }
        }
      )
    }

    return plainToInstance(RelationResDto, relation)
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

  // async create(dto: CreateFriendDto): Promise<FriendEntity> {
  //   const {userId, partnerId, actionType} = dto
  //   let friendRealate = await FriendEntity.findOneOrFail({
  //     where:{
  //       requirerId: In([userId, partnerId]),
  //       accepterId: In([userId, partnerId])
  //     }
  //   })

  //   switch (actionType) {
  //     case ActionFriendType.SENT:
  //       if (friendRealate) {
  //         throw new Error()
  //       }
  //       friendRealate = new FriendEntity({
  //         requirerId: userId,
  //         accepterId: partnerId,
  //         status: this.getFriendStatus(actionType)
  //       })
  //       await friendRealate.save()
  //     case ActionFriendType.REJECT:
  //       if (!friendRealate || friendRealate.status === FriendStatus.PENDING) {
  //         throw new Error()
  //       }
  //       await this.friendRepository.delete(friendRealate.id)
  //     case ActionFriendType.ACCEPT:
  //       if (!friendRealate || friendRealate.status === FriendStatus.PENDING) {
  //         throw new Error()
  //       }
  //       friendRealate.status = this.getFriendStatus(actionType)
  //       await this.friendRepository.save(friendRealate)
  //     case ActionFriendType.BLOCK:
  //       friendRealate.status = this.getFriendStatus(actionType)
  //       await this.friendRepository.save(friendRealate)
  //     default:
  //       break;
  //   }
  //   return friendRealate;
  // }

  // async sendRequireAddFriend(requirerId: Uuid, partnerId: Uuid){
  //   const friend = await this.findFriendRelation(requirerId, partnerId)
  //   if (friend.status) {
  //     throw new ValidationException(ErrorCode.FRIEND_E001)
  //   }
  //   const relation = await this.friendRepository.save(new FriendEntity({
  //     requirerId: requirerId,
  //     accepterId: partnerId,
  //     status: FriendStatus.PENDING
  //   }))

  //   return plainToInstance(FriendResDto, relation)
  // }

  // async acceptOrRejectRequestAddFriend(dto: AcceptOrRejectReqFriendDto){
  //   const friend = await this.friendRepository.findOneByOrFail({id: dto.relationId})
  //   if (dto.action === AcctionHanldeRequireAddFriend.REJECT) {
  //     await this.friendRepository.delete(friend.id)
  //   }else{
  //     friend.status = FriendStatus.ACCEPTED
  //     await this.friendRepository.save(friend)
  //   }
  //   return null
  // }

  // private async findFriendRelation(userId1:Uuid, userId2:Uuid): Promise<FriendEntity>{
  //   return await this.friendRepository.findOneBy([
  //     {
  //       requirerId: userId1,
  //       accepterId: userId2
  //     },
  //     {
  //       requirerId: userId2,
  //       accepterId: userId1
  //     }
  //   ])
  // }

  // private getFriendStatus(action: ActionFriendType){
  //   switch (action) {
  //     case ActionFriendType.SENT:
  //       return FriendStatus.PENDING
  //     case ActionFriendType.ACCEPT:
  //       return FriendStatus.ACCEPTED
  //     case ActionFriendType.BLOCK:
  //       return FriendStatus.BLOCKED
  //     default:
  //       throw new Error();
  //   }
  // }
}
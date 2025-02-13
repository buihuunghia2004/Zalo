import { Inject, Injectable } from '@nestjs/common';
// import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { MemberEntity } from './entities/member.entity';
import { ChatRoomEntity } from '../chat-room/entities/chat-room.entity';
import { MessageEntity } from './entities/message.entity';
import {
  MemberRole,
  MessageContentType,
  MessageViewStatus,
  RoomType,
} from '@/constants/entity.enum';
import { CursorPaginatedDto } from '@/common/dto/cursor-pagination/paginated.dto';
import { buildPaginator } from '@/utils/cursor-pagination';
import { CursorPaginationDto } from '@/common/dto/cursor-pagination/cursor-pagination.dto';
import { plainToInstance } from 'class-transformer';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SendMessageReqDto } from './dto/send-message.req.dto';
import { Uuid } from '@/common/types/common.type';
import { EventEmitterKey } from '@/constants/event-emitter.constant';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { LoadMoreMessagesReqDto } from './dto/load-more-messages.req.dto';
import { MessageResDto } from './dto/message.res.dto';
import { SortEnum } from '@/constants/sort.enum';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryResponse } from 'src/cloudinary/cloudinary/cloudinary-response';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { createCacheKey } from '@/utils/cache.util';
import { CacheKey } from '@/constants/cache.constant';


@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    @InjectRepository(ChatRoomEntity)
    private readonly chatRoomRepository: Repository<ChatRoomEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    private eventEmitter: EventEmitter2,
    private cloundService: CloudinaryService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async sendMessage(
    dto: SendMessageReqDto,
    file:Express.Multer.File,
    senderId: Uuid
  ): Promise<MessageResDto> {
    const { roomId, receiverId, content, contentType } = dto;
    
    let room = null
    let resultFile: CloudinaryResponse = null
    let memberSent: MemberEntity;

    if (contentType != MessageContentType.TEXT) {
      resultFile = await this.cloundService.uploadFile(file)
    }
    
    if (roomId) {
      room = await this.chatRoomRepository
        .createQueryBuilder('chatRoom')
        .select([
          'chatRoom.id',
        ])
        .leftJoin('chatRoom.members', 'members')
        .addSelect(['members.id','members.userId']) 
        .where('chatRoom.id = :roomId', { roomId })
        .getOne();
    }
    
    if (!room) {
      // Nếu không tồn tại room, tạo mới
      room = await this.createChatRoom(senderId, receiverId);
      await this.chatRoomRepository.save(room);
    }
  
    if (!memberSent) {
      memberSent = await this.memberRepository
        .createQueryBuilder('member')
        .leftJoinAndSelect('member.user', 'user')
        .select([
          'member.id',
          'user.id',
          'user.username',
          'user.avatarUrl',
        ])
        .where('member.roomId = :roomId', { roomId: room.id })
        .andWhere('member.userId = :userId', { userId: senderId })
        .getOne();
    }
    
    if (!memberSent) {
      throw new Error('Member sender not found');
    }
    
    const newMessage = new MessageEntity({
      senderId: memberSent.id,
      sender: memberSent,
      roomId: room.id,
      content: contentType == MessageContentType.TEXT ? content : resultFile.secure_url,
      type: contentType,
      replyMessageId: dto.replyMessageId,
      status: MessageViewStatus.SENT,
      createdBy: senderId,
      updatedBy: senderId,
    });
    
    await this.messageRepository.save(newMessage);
  
    //lọc danh sách member online và offline
    const members = room.members.filter(member => member.userId != senderId)
    const userIdKeys = members.map(m => createCacheKey(CacheKey.EVENT_CONNECT,m.userId))
    const userCacheIds = await this.cacheManager.store.mget(...userIdKeys)
    let onlineMembers = []
    let offineMembers = []
    userCacheIds.forEach((id, index) => {
      if (id) {
        //member.msgRTime = new Date(createdAt).getMilliseconds()
        onlineMembers.push(members[index])
      }else{
        offineMembers.push(members[index])
      }
    });

    const result = {
      ...newMessage,
      receivedMembers: onlineMembers.map(m => m.id)
    }

    // Gửi thông báo sự kiện
    this.eventEmitter.emit(EventEmitterKey.NEW_MESSAGE, {
      id:newMessage.id,
      content: contentType == MessageContentType.TEXT ? content : resultFile.secure_url,
      type: contentType,
      roomId: room.id,
      memberSentId: memberSent.id,
      sender: memberSent,
      createdAt: newMessage.createdAt,
      members: room.members.filter(member => member.userId != senderId),
    });

    return plainToInstance(MessageResDto, result)
  }
  

  async loadMoreMessage(reqDto: LoadMoreMessagesReqDto, meId: Uuid): Promise<CursorPaginatedDto<MessageResDto>> {    
    const queryBuilder = this.messageRepository
      .createQueryBuilder('message')
      .select([
        'message.id',
        'message.type',
        'message.content',
        'message.status',
        'message.createdAt',
      ])
      .leftJoin('message.parentMessage','replyMsg')
      .addSelect([
        'replyMsg.id',
        'replyMsg.type',
        'replyMsg.content',
        'replyMsg.status',
        'replyMsg.createdAt',
      ])
      .leftJoin('message.sender','sender')
      .addSelect([
        'sender.id',
      ])
      .leftJoin('sender.user','user')
      .addSelect([
        'user.id',
        'user.username',
        'user.avatarUrl',
      ])
      .where('message.roomId = :room_id', { room_id: reqDto.roomId });
    const paginator = buildPaginator({
      entity: MessageEntity,
      alias: 'message',
      paginationKeys: ['createdAt'],
      query: {
        limit: reqDto.limit,
        order: SortEnum.DESC,
        afterCursor: reqDto.afterCursor,
        beforeCursor: reqDto.beforeCursor,
      },
    });         

    const { data, cursor } = await paginator.paginate(queryBuilder);
    const result = data.map(item => {
      return {
        ...item,
        isSelfSent: item.sender.user.id == meId
      }
    })
    
    const metaDto = new CursorPaginationDto(
      result.length,
      cursor.afterCursor,
      cursor.beforeCursor,
      reqDto,
    );

    return new CursorPaginatedDto(plainToInstance(MessageResDto, result), metaDto);
  }


  async findAllMemberByRoomId(roomId: Uuid){
    const queryBuilder = await this.memberRepository
      .createQueryBuilder('members')
      .where('members.roomId = :roomId',{roomId})
      .getMany()
    return queryBuilder  
  }

  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  // update(id: number, updateMessageDto: UpdateMessageDto) {
  //   return `This action updates a #${id} message`;
  // }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }

  private async createChatRoom(senderId: Uuid, receiverId: Uuid): Promise<ChatRoomEntity> {
    const room = new ChatRoomEntity({
      type: RoomType.PERSONAL,
      createdBy: senderId,
      updatedBy: senderId,
    });

    await room.save()
  
    const member1 = new MemberEntity({
      userId: senderId,
      roomId: room.id,
      role: MemberRole.MEMBER,
      createdBy: SYSTEM_USER_ID,
      updatedBy: SYSTEM_USER_ID,
    });
  
    const member2 = new MemberEntity({
      userId: receiverId,
      roomId: room.id,
      role: MemberRole.MEMBER,
      createdBy: SYSTEM_USER_ID,
      updatedBy: SYSTEM_USER_ID,
    });
  
    await this.memberRepository.save([member1, member2]);
  
    room.members = [member1, member2];
    room.memberLimit = 2;
    
    await this.chatRoomRepository.save(room);
  
    return room;
  }
  
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { ListRoomReqDto } from './dto/list-room.req.dto';
import { RoomResDto } from './dto/room.res.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoomEntity } from '../message/entities/chat-room.entity';
import { Repository } from 'typeorm';
import { paginate } from '@/utils/offset-pagination';
import { plainToInstance } from 'class-transformer';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { MemberRole, MessageViewStatus, RoomLimit, RoomType } from '@/constants/entity.enum';
import { Uuid } from '@/common/types/common.type';
import { MemberEntity } from '../message/entities/member.entity';
import { MessageEntity } from '../message/entities/message.entity';
import { CreateGroupReqDto } from './dto/create-group.req.dto';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import assert from 'assert';

@Injectable()
export class ChatRoomService {

  constructor(
    @InjectRepository(ChatRoomEntity)
    private readonly roomRepository: Repository<ChatRoomEntity>,
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ){}

  async createGroup(dto: CreateGroupReqDto, meId: Uuid) : Promise<RoomResDto>{
    //create and save new group
    const newRoom = new ChatRoomEntity({
      type: RoomType.GROUP,
      groupName: dto?.groupName,
      groupAvatar: dto?.groupAvatar,
      memberLimit: RoomLimit.GROUP,
      createdBy: meId,
      updatedBy: SYSTEM_USER_ID
    })
    await this.roomRepository.save(newRoom)

    //create and save members
    const members = dto.userIds.map(id => new MemberEntity({
        role: MemberRole.MEMBER,
        roomId: newRoom.id,
        userId: id,
        createdBy: SYSTEM_USER_ID,
        updatedBy: SYSTEM_USER_ID
    }))
    const leader = new MemberEntity({
      role: MemberRole.LEADER,
      roomId: newRoom.id,
      userId: meId,
      createdBy: SYSTEM_USER_ID,
      updatedBy: SYSTEM_USER_ID
    })
    members.push(leader)
    await this.memberRepository.save(members)

    newRoom.members = members
    return plainToInstance(RoomResDto,newRoom);
  }


  async findAll(reqDto: ListRoomReqDto, meId: Uuid): Promise<OffsetPaginatedDto<RoomResDto>> {
    const roomIds = this.roomRepository
      .createQueryBuilder('r')
      .select(['r.id','r.type','r.groupName','r.groupAvatar'])
      .leftJoinAndSelect('r.members','m')
      .leftJoinAndSelect('r.members','m2')
      .leftJoin('m2.user','u')
      .addSelect([
        'u.id',
        'u.username',
        'u.avatarUrl'
      ])
      .where('m.userId = :meId',{meId})

    let [rooms, metaDto] = await paginate<ChatRoomEntity>(roomIds, reqDto, {
      skipCount: false,
      takeAll: false,
    });

    const data = await Promise.all(
      rooms.map(async room => {
        
        let roomAvatarUrl: string
        let roomName: string        
  
        if (room.type == RoomType.PERSONAL) {
          const user = room.members.find(member => member.user.id !=  meId)?.user
          
          if (user) {
            roomAvatarUrl = user.avatarUrl
            roomName = user.username
          }
        }else{
          roomAvatarUrl = room.groupAvatar
          roomName = room.groupName || this.getRoomNameFromMembers(room.members)
        }
  
        const lastMsg = await this.getLastMsgByRoomId(room.id)
        const quantityUnReadMessages = await this.getQuantityUnReadMessages(room.id)
  
        const result : any= {
          id: room.id,
          type: room.type,
          members:room.members,
          roomAvatarUrl,
          roomName,
        }
        result.quantityUnReadMessages = {...quantityUnReadMessages}
        if (lastMsg) {
          result.lastMsg = {...lastMsg, isSelfSent:meId == lastMsg.sender.userId}
        }
        
        return result
      })
    )
    return new OffsetPaginatedDto(plainToInstance(RoomResDto, data), metaDto);
  }

  async findAllGroups(reqDto: ListRoomReqDto, meId: Uuid): Promise<OffsetPaginatedDto<RoomResDto>> {
    const roomIds = this.roomRepository
      .createQueryBuilder('r')
      .select(['r.id','r.type'])
      .leftJoinAndSelect('r.members','m')
      .leftJoinAndSelect('r.members','m2')
      .leftJoin('m2.user','u')
      .addSelect([
        'u.id',
        'u.username',
        'u.avatarUrl'
      ])
      .where('m.userId = :meId',{meId})
      .andWhere('r.type = :type',{type: RoomType.GROUP})

    let [rooms, metaDto] = await paginate<ChatRoomEntity>(roomIds, reqDto, {
      skipCount: true,
      takeAll: true,
    });
    
    const data = await Promise.all(
      rooms.map(async room => {
        let roomAvatarUrl: string = room.groupAvatar
        let roomName: string = room.groupName || this.getRoomNameFromMembers(room.members)

        return {
          id: room.id,
          type: room.type,
          members:room.members,
          roomAvatarUrl,
          roomName,
        }
      })
    )

    return new OffsetPaginatedDto(plainToInstance(RoomResDto, data), metaDto);
  }

  async findOne(meId: Uuid, id: Uuid): Promise<RoomResDto> {
    assert(id, 'id is required');
    const room = await this.roomRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.members','m')
      .leftJoin('m.user','u')
      .addSelect(['u.id','u.avatarUrl','u.username'])
      .where('r.id = :id',{id})
      .getOne()

    const partner = room.members.find(m => m.userId != meId).user
      
    const lastMsg = await this.getLastMsgByRoomId(room.id)
    const result = {
      ...room,
      roomName: room.type == RoomType.GROUP ? (room.groupName || this.getRoomNameFromMembers(room.members) ) : partner.username,
      roomAvatarUrl: room.groupAvatar || partner.avatarUrl,
      lastMsg
    }
    return plainToInstance(RoomResDto, result)
  }

  async findOneByPartnerId(meId: Uuid, partnerId: Uuid): Promise<any>{
    const room = await this.memberRepository
      .createQueryBuilder('m')
      .innerJoinAndSelect('m.room', 'r')
      .select([
        'm.roomId AS roomId',
      ])
      .where('m.userId IN (:...userIds)', { userIds: [meId, partnerId] })
      .andWhere('r.type = :type', { type: RoomType.PERSONAL })
      .groupBy('m.roomId') 
      .having('COUNT(DISTINCT m.userId) = :count', { count: 2 })
      .getRawOne();

    if (!room) {
      throw new NotFoundException('Not found room')
    }
    return {roomId: room.roomid}
  }

  update(id: number, updateChatRoomDto: UpdateChatRoomDto) {
    return `This action updates a #${id} chatRoom`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatRoom`;
  }

  getLastMsgByRoomId = async (roomId: Uuid) => {
    return await this.messageRepository
        .createQueryBuilder('msg')
        .select([
          'msg.content',
          'msg.type',
          'msg.senderId',
          'msg.createdAt',
        ])
        .leftJoin('msg.sender','sender')
        .addSelect([
          'sender.id',
          'sender.userId',
        ])
        .where('msg.roomId = :roomId',{roomId: roomId})
        .orderBy({'msg.createdAt':'DESC'})
        .getOne()
  }
  getQuantityUnReadMessages = async (roomId: Uuid) => {
    return await this.messageRepository
      .createQueryBuilder('msg')
      .select('COUNT(msg.id)', 'unreadCount')  // Đếm số tin nhắn chưa đọc
      .where('msg.roomId = :roomId',{roomId: roomId})
      .andWhere('msg.status != :status', { status: MessageViewStatus.VIEWED })  // Loại bỏ tin nhắn đã xem
      .getRawOne(); 
  };
  

  getLastMsgByRoomIds = async (roomIds: Uuid[]) => {
    return await this.messageRepository
        .createQueryBuilder('msg')
        .select([
          'msg.content',
          'msg.type',
          'msg.senderId',
          'msg.createdAt',
        ])
        .leftJoin('msg.sender','sender')
        .addSelect([
          'sender.id',
          'sender.userId',
        ])
        .where('msg.roomId IN (:...roomIds)',{roomIds})
        .orderBy({'msg.createdAt':'DESC'})
        .getMany()
  }

  getRoomNameFromMembers = (members: MemberEntity[]): string => {
    let name = ''
    for (let index = 0; index < members.length; index++) {
      if (index == 4) {
        break
      }
      name += members[index].user.username
      if (index < members.length - 1) {
        name += ', '
      }
    }
    return name
  }
}

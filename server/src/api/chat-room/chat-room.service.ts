import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { ListRoomReqDto } from './dto/list-room.req.dto';
import { RoomResDto } from './dto/room.res.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoomEntity } from '../message/entities/chat-room.entity';
import { Brackets, Repository } from 'typeorm';
import { paginate } from '@/utils/offset-pagination';
import { plainToInstance } from 'class-transformer';
import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { RoomType } from '@/constants/entity.enum';
import { Uuid } from '@/common/types/common.type';
import { MemberEntity } from '../message/entities/member.entity';
import { MessageEntity } from '../message/entities/message.entity';

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

  create(createChatRoomDto: CreateChatRoomDto) {
    return 'This action adds a new chatRoom';
  }

  async findAll(reqDto: ListRoomReqDto, meId: Uuid): Promise<OffsetPaginatedDto<RoomResDto>> {
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
          roomName = room.groupName
        }
  
        const lastMsg = await this.messageRepository
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
        .where('msg.roomId = :roomId',{roomId: room.id})
        .orderBy({'msg.createdAt':'DESC'})
        .getOne()
  
        return {
          id: room.id,
          type: room.type,
          members:room.members,
          roomAvatarUrl,
          roomName,
          lastMsg:{...lastMsg, isSelfSent:meId == lastMsg.sender.userId}
        }
      })
    )
    return new OffsetPaginatedDto(plainToInstance(RoomResDto, data), metaDto);    
  }

  findOne(id: number) {
    return `This action returns a #${id} chatRoom`;
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
}

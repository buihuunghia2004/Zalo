import { UserEntity } from "@/api/user/entities/user.entity";
import { Uuid } from "@/common/types/common.type";
import { MemberRole } from "@/constants/entity.enum";
import { AbstractEntity } from "@/database/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChatRoomEntity } from "../../chat-room/entities/chat-room.entity";
import { MessageEntity } from "./message.entity";

@Entity('member')
export class MemberEntity extends AbstractEntity{
  constructor(data?: Partial<MemberEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_member_id' })
  id!: Uuid;

  @Column({type:'enum', enum:MemberRole})
  role!: MemberRole 

  @Column({name: 'user_id'})
  userId!: Uuid

  @Column({name: 'room_id'})
  roomId!: Uuid

  @Column({name: 'received_msg_id', nullable:true})
  receivedMsgId?: Uuid

  @Column({name: 'viewed_msg_id', nullable: true})
  viewedMsgId?: Uuid

  @Column({name: 'msg_r_time', nullable:true, default: new Date()})
  msgRTime?: Date

  @Column({name: 'msg_v_time', nullable: true, default: new Date()})
  msgVTime?: Date

  @OneToMany(()=>MessageEntity,(message)=>message.sender)
  messages: MessageEntity[]

  @ManyToOne(()=>UserEntity, (userEntity) => userEntity.members)
  @JoinColumn({
    name:'user_id',
    referencedColumnName:'id',
    foreignKeyConstraintName:'FK_member_user'
  })
  user: UserEntity

  @ManyToOne(()=>ChatRoomEntity, (chatRoom) => chatRoom.members)
  @JoinColumn({
    name:'room_id',
    referencedColumnName:'id',
    foreignKeyConstraintName:'FK_member_chatroom'
  })
  room: ChatRoomEntity
}

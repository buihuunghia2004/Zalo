import { Uuid } from '@/common/types/common.type';
import { MessageContentType, MessageViewStatus } from '@/constants/entity.enum';
import {
  BooleanField,
  ClassField,
  DateField,
  NumberField,
  StringField,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';
import { WrapperType } from '@/common/types/types';
import { MemberResDto } from '@/api/relationship/dto/member.res.dto';
import { RoomResDto } from '@/api/chat-room/dto/room.res.dto';

@Exclude()
export class MessageResDto {
  @StringField()
  @Expose()
  id: string;

  @StringField()
  @Expose()
  content: string;

  @StringField()
  @Expose()
  type: MessageContentType;

  @StringField()
  @Expose()
  replyMessageId: Uuid;

  @StringField()
  @Expose()
  senderId: Uuid;
  
  @StringField()
  @Expose()
  roomId: Uuid;

  @BooleanField()
  @Expose()
  isSelfSent: boolean;

  @StringField()
  @Expose()
  status: MessageViewStatus;

  @ClassField(()=> MemberResDto)
  @Expose()
  sender: WrapperType<MemberResDto>;

  @StringField({each: true})
  @Expose()
  receivedMemberIds: string;

  @ClassField(()=> RoomResDto)
  @Expose()
  room?: WrapperType<RoomResDto>;

  @ClassField(()=> MessageResDto)
  @Expose()
  messageReply?: WrapperType<MessageResDto>;

  @ClassField(()=> MessageResDto)
  @Expose()
  replyMessage?: WrapperType<MessageResDto>;

  @DateField()
  @Expose()
  createdAt?: Date;

  @NumberField()
  @Expose()
  unReadMsgCount?: number;
}

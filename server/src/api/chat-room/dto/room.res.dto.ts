import { MessageResDto } from '@/api/message/dto/message.res.dto';
import { MemberResDto } from '@/api/relationship/dto/member.res.dto';
import { WrapperType } from '@/common/types/types';
import { RoomType } from '@/constants/entity.enum';
import {
  ClassFieldOptional,
  EnumField,
  NumberField,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RoomResDto {
  @StringField()
  @Expose()
  id: string;

  @StringFieldOptional()
  @Expose()
  roomAvatarUrl: string;

  @StringFieldOptional({each: true})
  @Expose()
  roomAvatarUrls: string[];

  @StringField()
  @Expose()
  roomName: string;

  @EnumField(()=>RoomType)
  @Expose()
  type: RoomType;

  @NumberFieldOptional()
  @Expose()
  memberCount: number;

  @StringFieldOptional()
  @Expose()
  memberId: number;

  @ClassFieldOptional(()=> MessageResDto)
  @Expose()
  lastMsg?: WrapperType<MessageResDto>;

  @ClassFieldOptional(()=> MemberResDto)
  @Expose()
  members: WrapperType<MemberResDto[]>;

  @NumberFieldOptional()
  @Expose()
  unReadMsgCount?: number;
}

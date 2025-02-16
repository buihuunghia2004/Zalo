import { RoomResDto } from '@/api/chat-room/dto/room.res.dto';
import { UserResDto } from '@/api/user/dto/user.res.dto';
import { WrapperType } from '@/common/types/types';
import { MemberRole } from '@/constants/entity.enum';
import {
  ClassField,
  DateField,
  EnumField,
  StringField,
} from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MemberResDto {
  @StringField()
  @Expose()
  id: string;

  @DateField()
  @Expose()
  msgRTime: Date;

  @DateField()
  @Expose()
  msgVTime: Date;

  @EnumField(()=>MemberRole)
  @Expose()
  role: MemberRole;

  @ClassField(()=>UserResDto)
  @Expose()
  user: UserResDto;

  @ClassField(()=>RoomResDto)
  @Expose()
  room: WrapperType<RoomResDto>;

}

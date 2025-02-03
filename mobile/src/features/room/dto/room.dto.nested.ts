import {UserBase} from '~/features/user/dto/user.dto.nested';
import { RoomTypeEnum } from './room.enum';

export interface Room {
  id: string;
  roomAvatarUrl: string;
  roomName: string;
  type: RoomTypeEnum;
  members: MemberDto[];
}
export interface MemberDto {
  id: string;
  role: string;
  user: UserBase;
}

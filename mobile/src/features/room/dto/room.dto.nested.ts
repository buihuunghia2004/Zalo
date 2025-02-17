import {UserBase} from '~/features/user/dto/user.dto.nested';
import { RoomTypeEnum } from './room.enum';
import { MemberBase } from '~/features/message/dto/message.dto.nested';
import { _MessageSentRes } from '~/features/message/dto/message.dto.parent';

export interface Room {
  id: string;
  roomAvatarUrl: string;
  roomAvatarUrls: string[];
  roomName: string;
  type: RoomTypeEnum;
  members?: MemberDto[];
  lastMsg: LastMsg
  memberCount: number
  quantityUnReadMessages?: number
}
export interface MemberDto {
  id: string;
  role: string;
  user: UserBase;
}

export interface LastMsg {
  content: string;
  type: string;
  senderId: string;
  isSelfSent: boolean
  sender: MemberBase
  createAt: Date;
}
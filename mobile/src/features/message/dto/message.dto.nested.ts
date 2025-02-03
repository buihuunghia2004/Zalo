import {UserBase} from '~/features/user/dto/user.dto.nested';
import { MessageContentEnum, MessageViewStatus } from './message.enum';



export interface Member {
  id: string;
  role: string;
  userId: string;
  roomId: string;
}
export interface MemberBase {
  id: string;
  user: UserBase;
}
export interface MessageBase {
  id: string;
  content: string;
  isSelfSent: boolean;
  type: MessageContentEnum;
  status: MessageViewStatus;
}


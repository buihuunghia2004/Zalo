import { UserBase } from '~/features/user/dto/user.dto.nested';
import { MessageContentType, MessageViewStatus } from './message.enum';
import { MemberResDto } from '~/features/room/dto/room.dto.nested';

export interface MessageBase {
  id: string;
  content: string;
  isSelfSent: boolean;
  type: MessageContentType;
  status: MessageViewStatus;
}
export interface MessagParente {
  id: string;
  content: string;
  sender: MemberResDto
  type: MessageContentType;
  createdAt: Date;
}

import { UserBase } from '~/features/user/dto/user.dto.nested';
import { MessageContentType, MessageStatus } from './message.enum';
import { MemberResDto } from '~/features/room/dto/room.dto.nested';
import { messageEntity } from '../messageEntity';

export interface MessageBase {
  id: string;
  content: string;
  isSelfSent: boolean;
  type: MessageContentType;
  status: MessageStatus;
}
export interface MessagParente {
  id: string;
  content: string;
  sender: MemberResDto
  type: MessageContentType;
  createdAt: Date;
}
export interface MessageTemp
  extends Pick<
    messageEntity,
    'id' | 'content' | 'type' | 'replyMessage'
  > {
  receivedMemberIds?: string[];
  sender?: MemberResDto;
  replyMessageId?: string;
  replyMessage?: MessagParente;
  isSelfSent?: boolean;
  status?: MessageStatus
  createdAt: Date;
}
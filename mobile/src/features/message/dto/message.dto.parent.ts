import { MemberResDto } from '~/features/room/dto/room.dto.nested';
import {messageEntity} from '../messageEntity';
import { MessageContentType, MessageStatus } from './message.enum';
import { Message } from 'yup';
import { MessagParente } from './message.dto.nested';

export interface _MessageSentReq {
  receiverId?: string;
  roomId?: string;
  content: string;
  contentType: MessageContentType;
}
export interface _MessageSentRes
  extends Pick<
    messageEntity,
    'id' | 'content' | 'type' | 'replyMessage'| 'senderId' | 'roomId' | 'revoked'| 'createdAt' 
  > {
  receivedMemberIds?: string[];
  sender?: MemberResDto;
  replyMessageId?: string;
  replyMessage?: MessagParente;
  isSelfSent?: boolean;
  status?: MessageStatus
}

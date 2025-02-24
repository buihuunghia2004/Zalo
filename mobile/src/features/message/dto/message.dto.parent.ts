import { MemberResDto } from '~/features/room/dto/room.dto.nested';
import {messageEntity} from '../messageEntity';
import { MessageContentType } from './message.enum';

export interface _MessageSentReq {
  receiverId?: string;
  roomId?: string;
  content: string;
  contentType: MessageContentType;
}
export interface _MessageSentRes
  extends Pick<
    messageEntity,
    'id' | 'content' | 'type' | 'replyMessage'
  > {
  sender?: MemberResDto;
  roomId?: string;
  isSelfSent?: boolean;
  createdAt: Date;
}
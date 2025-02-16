import {MemberBase} from './message.dto.nested';
import {messageEntity} from '../messageEntity';
import { MessageContentEnum } from './message.enum';
import { Room } from '~/features/room/dto/room.dto.nested';

export interface _MessageSentReq {
  receiverId?: string;
  roomId?: string;
  content: string;
  contentType: MessageContentEnum;
}
export interface _MessageSentRes
  extends Pick<
    messageEntity,
    'id' | 'content' | 'type' | 'status' | 'replyMessageId'
  > {
  sender?: MemberBase;
  roomId?: string;
  isSelfSent?: boolean;
  createdAt?: Date;
}
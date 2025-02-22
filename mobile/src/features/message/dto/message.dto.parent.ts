import {MemberBase} from './message.dto.nested';
import {messageEntity} from '../messageEntity';
import { MessageContentEnum } from './message.enum';

export interface _MessageSentReq {
  receiverId?: string;
  roomId?: string;
  content: string;
  contentType: MessageContentEnum;
}
export interface _MessageSentRes
  extends Pick<
    messageEntity,
    'id' | 'content' | 'type' | 'parentMessage'
  > {
  sender?: MemberBase;
  roomId?: string;
  isSelfSent?: boolean;
  createdAt: Date;
}
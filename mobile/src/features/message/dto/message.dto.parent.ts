import {ApiResHasPagination} from '~/features/common/pagination/paginationDto';
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
  room?: Room;
  isSelfSent?: boolean;
  createdAt?: Date;
}

export interface _MessageLoadRes
  extends ApiResHasPagination<_MessageSentRes[]> {}

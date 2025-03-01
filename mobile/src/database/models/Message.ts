import { Model } from '@nozbe/watermelondb';
import { field, date, immutableRelation } from '@nozbe/watermelondb/decorators';
import ChatRoom from './Room'; // Model ChatRoom
import Member from './Member'; // Model Member
import { MessageStatus } from '~/features/message/dto/message.enum';

export default class Message extends Model {
  static table = 'messages';

  @field('content') content!: string | Uint8Array;
  @field('sub_content') subContent?: string;
  @field('type') type!: string; // Dùng string thay vì enum
  @field('sender_id') senderId!: string;
  @field('room_id') roomId!: string;
  @field('reply_message_id') replyMessageId?: string;
  @field('status') status!: MessageStatus;
  @field('revoked') revoked!: boolean;
  @date('created_at') createdAt!: number;

  // Quan hệ với ChatRoom
  @immutableRelation('chat_rooms', 'room_id') room!: ChatRoom;
  
  // Quan hệ với Member (người gửi)
  @immutableRelation('members', 'sender_id') sender!: Member ;

  // Tin nhắn được reply (dùng query để lấy danh sách replies)
  @immutableRelation('messages', 'reply_message_id') replyMessage?: Message;
}

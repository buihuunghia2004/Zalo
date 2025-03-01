import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';
import { RoomTypeEnum } from '~/features/room/dto/room.enum';

export default class Room extends Model {
  static table = 'rooms';

  // Các trường cơ bản của phòng
  @field('type') type!: RoomTypeEnum;
  @text('group_name') groupName!: string;
  @text('group_avatar') groupAvatar!: string;
  @field('unread_count') unreadCount?: number;

  // Các trường liên quan đến tin nhắn cuối cùng
  @text('last_msg_content') lastMsgContent?: string;
  @field('last_msg_created_at') lastMsgCreatedAt?: number;
  @field('last_msg_sender_id') lastMsgSenderId?: string;
  @field('last_msg_type') lastMsgType?: string;
  @field('last_msg_status') lastMsgStatus?: string;
  @field('last_msg_revoked') lastMsgRevoked?: boolean;
  @text('last_msg_sender_name') lastMsgSenderName?: string;
}
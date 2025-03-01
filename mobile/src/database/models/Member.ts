import { Model } from '@nozbe/watermelondb';
import { field, date, immutableRelation } from '@nozbe/watermelondb/decorators';
import User from './User';
import Room from './Room';

export default class Member extends Model {
  static table = 'members';

  @field('role') role!: string;
  @field('user_id') userId!: string;
  @field('room_id') roomId!: string;
  @field('received_msg_id') receivedMsgId?: string;
  @field('viewed_msg_id') viewedMsgId?: string;
  @date('msg_r_time') msgRTime?: number;
  @date('msg_v_time') msgVTime?: number;

  @immutableRelation('users', 'user_id') user!: User;
  @immutableRelation('chatrooms', 'room_id') room!: Room;
}

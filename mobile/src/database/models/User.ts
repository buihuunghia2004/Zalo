import { Model } from '@nozbe/watermelondb';
import { field, date, text, readonly, writer } from '@nozbe/watermelondb/decorators';

export default class User extends Model {
  static table = 'users';

  @text('username') username!: string;
  @text('bio') bio!: string;
  @text('avatar_url') avatarUrl!: string;
  @date('last_accessed') lastAccessed!: number;
  @text('client_id') clientId!: string;
  @field('is_online') isOnline!: boolean;
  @date('last_online') lastOnline!: number;

}

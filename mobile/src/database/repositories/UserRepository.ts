import { Q } from '@nozbe/watermelondb';
import { database } from '~/database';
import User from '~/database/models/User';

export default class UserRepository {
  private usersCollection = database.get<User>('users');

  // Thêm một người dùng
  async addUser(userData: Partial<User>) {
    return database.write(async () => {
      return await this.usersCollection.create((user) => {
        user.username = userData.username!;
        user.bio = userData.bio || '';
        user.avatarUrl = userData.avatarUrl || '';
        user.lastAccessed = userData.lastAccessed || Date.now();
        user.clientId = userData.clientId!;
        user.isOnline = userData.isOnline || false;
        user.lastOnline = userData.lastOnline || Date.now();
      });
    });
  }

  // Thêm nhiều người dùng
  async addUsers(usersData: Partial<User>[]) {
    return database.write(async () => {
      for (const userData of usersData) {
        await this.usersCollection.create((user) => {
          user.username = userData.username!;
          user.bio = userData.bio || '';
          user.avatarUrl = userData.avatarUrl || '';
          user.lastAccessed = userData.lastAccessed || Date.now();
          user.clientId = userData.clientId!;
          user.isOnline = userData.isOnline || false;
          user.lastOnline = userData.lastOnline || Date.now();
        });
      }
    });
  }

  // Lấy người dùng theo ID
  async getUserById(userId: string) {
    return await this.usersCollection.query(Q.where('id', userId)).fetch();
  }
}

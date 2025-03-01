import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { databaseSchema } from './schemas';
import User from './models/User';
import Room from './models/Room';
import Message from './models/Message';
import Member from './models/Member';

const adapter = new SQLiteAdapter({
  schema: databaseSchema,
  dbName: 'lazo',
});

export const database = new Database({
  adapter,
  modelClasses: [User, Room, Message, Member],
});

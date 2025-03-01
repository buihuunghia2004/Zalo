import { appSchema } from '@nozbe/watermelondb';
import { userSchema } from './userSchema';
import { roomSchema } from './roomSchema';
import { messageSchema } from './messageSchema';
import { memberSchema } from './memberSchema';

export const databaseSchema = appSchema({
  version: 4,
  tables: [
    userSchema,
    roomSchema,
    messageSchema,
    memberSchema,
  ],
});

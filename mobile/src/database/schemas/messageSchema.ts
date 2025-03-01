import { tableSchema} from '@nozbe/watermelondb';

export const messageSchema = tableSchema({
  name: 'messages',
  columns: [
    {name: 'content', type: 'string'},
    {name: 'senderId', type: 'string'},
    {name: 'roomId', type: 'string'},
    {name: 'type', type: 'string'},
    {name: 'status', type: 'boolean'},
    {name: 'replyMessageId', type: 'string'},
    {name: 'revoked', type: 'boolean'},
    {name: 'created_at', type: 'number'},
  ],
});

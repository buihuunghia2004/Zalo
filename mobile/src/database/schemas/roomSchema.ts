import { tableSchema } from '@nozbe/watermelondb';

export const roomSchema = tableSchema({
  name: 'rooms',
  columns: [
    { name: 'type', type: 'string' }, 
    { name: 'group_name', type: 'string' }, 
    { name: 'group_avatar', type: 'string'}, 
    { name: 'unread_count', type: 'number'},

    { name: 'last_msg_content', type: 'string', isOptional: true },
    { name: 'last_msg_created_at', type: 'number', isOptional: true },
    { name: 'last_msg_sender_id', type: 'string', isOptional: true },
    { name: 'last_msg_type', type: 'string', isOptional: true },
    { name: 'last_msg_status', type: 'string', isOptional: true },
    { name: 'last_msg_revoked', type: 'boolean', isOptional: true },
    { name: 'last_msg_sender_name', type: 'string', isOptional: true },
  ],
});

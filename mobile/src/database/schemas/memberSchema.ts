import { tableSchema } from '@nozbe/watermelondb';

export const memberSchema = tableSchema({
  name: 'members',
  columns: [
    { name: 'role', type: 'string' }, 
    { name: 'user_id', type: 'string' }, 
    { name: 'room_id', type: 'string' }, 
    { name: 'received_msg_id', type: 'string', isOptional: true }, 
    { name: 'viewed_msg_id', type: 'string', isOptional: true }, 
    { name: 'msg_r_time', type: 'number', isOptional: true },
    { name: 'msg_v_time', type: 'number', isOptional: true },
  ],
});

import { tableSchema } from '@nozbe/watermelondb';

export const userSchema = tableSchema({
  name: 'users',
  columns: [
    { name: 'username', type: 'string' }, 
    { name: 'bio', type: 'string', isOptional: true }, 
    { name: 'avatar_url', type: 'string' }, 
    { name: 'last_accessed', type: 'number' }, 
    { name: 'client_id', type: 'string', isOptional: true },
    { name: 'is_online', type: 'boolean' }, 
    { name: 'last_online', type: 'number' }
  ],
});

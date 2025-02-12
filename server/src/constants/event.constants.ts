export enum EventKey {
  EVENT_CONNECT = 'event:connect%s', // %s: userId
  NOTIFY_REQUEST_ADD_FRIEND_SENT = 'event:notify:%s:request_add_friend_send', // %s: userId
  NEW_MESSAGE = 'event:notify:%s:new_message' // %s: userId
}

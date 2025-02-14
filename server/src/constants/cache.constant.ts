export enum CacheKey {
  SESSION_BLACKLIST = 'auth:session-blacklist:%s', // %s: sessionId
  EMAIL_VERIFICATION = 'auth:token:%s:email-verification', // %s: userId
  PASSWORD_RESET = 'auth:token:%s:password', // %s: userId
  EVENT_CONNECT = 'event:connect%s', // %s: clientId in socket
  NOTI_SOCKET_CONNECT = 'noti_socket_connect:%s', //userId
  
  //messages
  UNRECEIVE_MSG = 'unreceive-msg:%s', //userId
  JOIN_ROOM = 'join-room:%s' //clientId
}

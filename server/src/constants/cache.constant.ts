export enum CacheKey {
  SESSION_BLACKLIST = 'auth:session-blacklist:%s', // %s: sessionId
  EMAIL_VERIFICATION = 'auth:token:%s:email-verification', // %s: userId
  PASSWORD_RESET = 'auth:token:%s:password', // %s: userId
  MSG_SOCKET_CONNECT = 'socket-msg-connect:%s', // %s: clientId in socket
  NOTI_SOCKET_CONNECT = 'socket_noti_connect:%s', //userId
  MEMBER_CLIENT = 'member:%s', //clientId
  USER_CLIENT = 'user:%s', //clientId
  //messages
  UNRECEIVE_MSG = 'unreceive-msg:%s', //userId
  JOIN_ROOM = 'join-room:%s' //clientId
}

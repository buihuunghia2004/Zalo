export enum AuthProviderType {
  EMAIL_PASSWORD = 'email_password',
  GOOGLE = 'google',
}

export enum Role{
  SUPER_ADMIN =  'supperadmin',
  ADMIN = 'admin',
  USER = 'user'
}


export enum ResponseRelationStatus{
  NOTTHING = 'notthing',
  PENDING =  'pending',
  FRIEND = 'friend',
  BLOCKED = 'blocked'
}

export enum Who{
  ME = 'me',
  PARTNER = 'partner'
}

export enum ActionRelationType{
  SENT =  'sent',
  REVOKE = 'revoke',
  ACCEPT = 'accept',
  DECLINE = 'decline',
  BLOCK = 'block'
}

export enum RoomType{
  PERSONAL = 'personal',
  GROUP = 'group'
}

export enum RoomLimit{
  PERSONAL = 2,
  GROUP = 100,
  COMMUNITY = 1000
}

export enum MemberRole{
  LEADER = 'leader',
  VICER = 'vicer',
  MEMBER = 'member'
}

export enum MessageViewStatus{
  SENT = 'sent',
  RECEIVED = 'received',
  VIEWED = 'viewed',
  REVOKED = 'revoked',
}

export enum MessageContentType{
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  VOICE = 'voice',
  FILE = 'file',
}

export enum Gender{
  MALE = 'male',
  FEMALE = 'female'
}
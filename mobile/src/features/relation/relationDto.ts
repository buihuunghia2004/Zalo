
export enum RelationAction{
    SENT =  'sent',
    REVOKE = 'revoke',
    ACCEPT = 'accept',
    DECLINE = 'decline',
    BLOCK = 'block'
  }

export interface SendRequestReq {
    receiverId: string
}
export interface SendRequestRes {
    id: string,
    username: string,
    bio: string,
    dob: Date,
    gender: string,
    email: string,
    avatarUrl: string
}

export interface handleRequestReq {
    id: string,
    requesterId: string,
    handlerId: string,
    status: string,
}
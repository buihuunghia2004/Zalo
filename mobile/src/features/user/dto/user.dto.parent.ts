import { UserFriend, UserSearch } from "./user.dto.nested"
import { InviterTypeEnum } from "./user.enum"


export interface UserSearchRes {
    id: string,
    status: string,
    inviter: InviterTypeEnum,
    user: UserSearch
}

export interface UserSendAddFriend {
  
}
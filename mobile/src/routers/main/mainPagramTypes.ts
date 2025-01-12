import { UserSearchRes } from "~/features/user/userDto";

export enum ProfileOptions {
  Friend = 'Friend', 
  NotFriend = 'NotFriend', 
  Self = 'Self', 
}

export interface ProfilePersonalPagram extends UserSearchRes {
  options:  ProfileOptions
}

export interface SenAddFriendPagram extends Omit<UserSearchRes, 'email' | 'dob' | 'gender'| 'bio'>{}

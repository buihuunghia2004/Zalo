import { UserSearchRes } from "~/features/user/dto/user.dto.parent";
import { UserEntity } from "~/features/user/userEntity";

export enum ProfileOptions {
  Friend = 'Friend', 
  NotFriend = 'NotFriend', 
  Self = 'Self', 
}

export interface ProfilePersonalPagram extends UserSearchRes {
  options:  ProfileOptions
}

export interface BaseProfilePagram extends Pick<UserEntity, 'id' | 'username' | 'avatarUrl' >{}

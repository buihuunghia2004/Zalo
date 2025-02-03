import { UserEntity } from "../userEntity";

export interface UserSearch extends Pick<UserEntity, 
    'id' | 'username' | 'bio' | 'dob' | 'gender' | 'email' | 'avatarUrl'> {}


export interface UserFriend extends Pick<UserEntity,
 'id' | 'username' | 'email' | 'bio' | 'avatarUrl' | 'avatarPid' | 'isOnline' | 'lastOnline' | 'dob' | 'gender'> {}



 export interface UserBase extends Pick<UserEntity,'id' | 'username' | 'avatarUrl'>{}
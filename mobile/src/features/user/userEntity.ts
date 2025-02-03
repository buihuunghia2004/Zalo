import { GenderEnum } from "./dto/user.enum";

export interface UserEntity {
  id: string;
  username?: string;
  bio?: string;
  dob?: Date;
  gender?: GenderEnum;
  email?: string;
  avatarUrl?: string;
  avatarPid?: string;
  isActive: boolean;
  isVerify: boolean;
  lastAccessed: Date;
  clientId?: string;
  isOnline: boolean;
  lastOnline: Date;
}

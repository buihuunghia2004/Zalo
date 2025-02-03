import {RoomTypeEnum} from './dto/room.enum';

export interface RoomEntity {
  id: string;
  type: RoomTypeEnum;
  groupName?: string;
  groupAvatar?: string;
  memberLimit: number;
}

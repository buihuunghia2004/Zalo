import { RoomTypeEnum } from "~/features/room/dto/room.enum";

export interface RoomItemView {
    id: string; 
    type: RoomTypeEnum;
    groupName: string;
    groupAvatar: string;
    unreadCount?: number | undefined; // Cho phép undefined  
    // Thông tin tin nhắn cuối cùng
    lastMsgId?: string;
    lastMsgContent?: string;
    lastMsgCreatedAt?: number;
    lastMsgSenderId?: string;
    lastMsgType?: string;
    lastMsgStatus?: string;
    lastMsgRevoked?: boolean;
    lastMsgSenderName?: string;
  }
  
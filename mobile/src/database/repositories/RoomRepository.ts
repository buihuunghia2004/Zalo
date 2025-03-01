import { database } from '~/database';
import { Q } from '@nozbe/watermelondb';
import Room from '~/database/models/Room';
import { Room as RoomDTO } from '~/features/room/dto/room.dto.nested';
import { arrayToString } from '~/utils/Convert/string_arrayConvert';
import { RoomItemView } from '../dto/room.dto';

class RoomRepository {  

  private roomsCollection = database.get<Room>('rooms');

  // Hàm cắt content còn 40 ký tự
  private truncateContent(content?: string): string | undefined {
    return content ? content.slice(0, 40) : undefined;
  }

  async saveRooms(rooms: RoomDTO[], appendOnly: boolean = false): Promise<void> {
    await database.write(async () => {
      const roomArray = Array.isArray(rooms) ? rooms : [rooms];

      if (!appendOnly) {
        const allRooms = await this.roomsCollection.query().fetch();
        await Promise.all(allRooms.map(room => room.destroyPermanently()));
      }

      for (const roomData of roomArray) {
        const existingRoom = await this.roomsCollection.query(Q.where('id', roomData.id)).fetch();

        if (existingRoom.length === 0) {
          await this.roomsCollection.create(room => {
            room._raw.id = roomData.id;
            room.type = roomData.type!;
            room.groupName = roomData.roomName;
            room.unreadCount = roomData.unReadMsgCount;
            room.groupAvatar = roomData.roomAvatarUrl || arrayToString(roomData.roomAvatarUrls);
            room.lastMsgContent = this.truncateContent(roomData.lastMsg?.content);
            room.lastMsgCreatedAt = roomData.lastMsg?.createdAt instanceof Date
              ? roomData.lastMsg.createdAt.getTime()
              : roomData.lastMsg?.createdAt;
            room.lastMsgSenderId = roomData.lastMsg?.senderId;
            room.lastMsgType = roomData.lastMsg?.type;
            room.lastMsgStatus = roomData.lastMsg?.status; 
            room.lastMsgRevoked = roomData.lastMsg?.revoked;
            room.lastMsgSenderName = roomData.lastMsg?.sender.user.username; 
          });
        }
      }
    });
  }

  async getRoomById(roomId: string): Promise<RoomDTO | null> {
    const roomDB = await this.roomsCollection.query(Q.where('id', roomId)).fetch();
    if (roomDB.length === 0) return null;

    const roomModel = roomDB[0];
    return {
      id: roomId,
      type: roomModel.type,
      roomName: roomModel?.groupName,
      unReadMsgCount: roomModel.unreadCount,
      roomAvatarUrl: roomModel.groupAvatar,
      roomAvatarUrls: roomModel.groupAvatar ? roomModel.groupAvatar.split(',').map(item => item.trim()) : [],
    };
  }

  async getAllRooms(): Promise<RoomItemView[]> {
    console.log('111111111111');
    
    if (!this.roomsCollection) {
      console.error('roomsCollection không được khởi tạo');
      return [];
    }
    console.log('22222222222');
    
    const roomDB = await this.roomsCollection.query().fetch();

    console.log('roomDB', roomDB.length);
    

    return roomDB.map(roomModel => ({
      id: roomModel?.id,
      type: roomModel?.type,
      groupName: roomModel?.groupName,
      unreadCount: roomModel?.unreadCount,
      groupAvatar: roomModel?.groupAvatar,
      lastMsgContent: roomModel?.lastMsgContent,
      lastMsgCreatedAt: roomModel?.lastMsgCreatedAt,
      lastMsgSenderId: roomModel?.lastMsgSenderId,
      lastMsgType: roomModel?.lastMsgType,
      lastMsgStatus: roomModel?.lastMsgStatus,
      lastMsgRevoked: roomModel?.lastMsgRevoked,
      lastMsgSenderName: roomModel?.lastMsgSenderName,
    }));
  }
}

export default new RoomRepository();
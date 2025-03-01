import RoomRepository from '~/database/repositories/RoomRepository';
import {Room} from '~/features/room/dto/room.dto.nested';

// Đồng bộ danh sách phòng từ API
export const syncRoomsFromAPi = async (rooms: Room[]): Promise<void> => {
  await RoomRepository.saveRooms(rooms, false); // Xóa dữ liệu cũ
};

export const syncRoomFromSocket = async (room: Room): Promise<void> => {
  await RoomRepository.saveRooms([room], true); // Chỉ thêm mới
};

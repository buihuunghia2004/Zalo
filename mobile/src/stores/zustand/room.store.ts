import { create } from "zustand";
import { _MessageSentRes } from "~/features/message/dto/message.dto.parent";
import { Room } from "~/features/room/dto/room.dto.nested";
import { RoomService } from "~/features/room/roomService";

interface RoomStore {
  rooms: Room[];
  unReadMessagesRooms: any;
  fetchRooms: () => void;
  resetUnReadCount: (id: string) => void;
  receiveNewMessage: (message: _MessageSentRes) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  rooms: [],
  unReadMessagesRooms: {},
  
  fetchRooms: async () => {
    const data = await RoomService.getAllRoom();
    if (!data || !Array.isArray(data)) return;

    // Sắp xếp theo `createdAt` của `lastMsg` (mới nhất lên trước)
    const sortedRooms = data.sort((a, b) => {
      const timeA = a.lastMsg?.createdAt ? new Date(a.lastMsg.createdAt).getTime() : 0;
      const timeB = b.lastMsg?.createdAt ? new Date(b.lastMsg.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    set({ rooms: sortedRooms });
  },
  resetUnReadCount:(id) =>  set((state) => {
    return {
      rooms: state.rooms.map(room => room.id === id ? {...room, unReadMsgCount: 0} : room),
    }as Partial<RoomStore>;
  }),
  receiveNewMessage: (message) =>
    set((state) => {
      if (!message.roomId) return { rooms: state.rooms }; 
      
      const room = state.rooms.find((room) => room.id === message.roomId);
      if (!room) return { rooms: state.rooms }; 
      
      return {
        rooms: state.rooms.map(
          (r) => (r.id === message.roomId ? { ...r, unReadMsgCount: r.unReadMsgCount + 1, lastMsg: message } : r)
        ).sort((a, b) => new Date(b.lastMsg.createdAt).getTime() - new Date(a.lastMsg.createdAt).getTime()),
      } as Partial<RoomStore>;
    }),
}));

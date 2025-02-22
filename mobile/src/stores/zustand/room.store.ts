import { create } from "zustand";
import { _MessageSentRes } from "~/features/message/dto/message.dto.parent";
import { Room } from "~/features/room/dto/room.dto.nested";
import { RoomService } from "~/features/room/roomService";

interface RoomStore {
  rooms: Room[];
  unReadMessagesRooms: any;
  fetchRooms: () => void;
  setUnReadMessagesRooms: (item: any) => void;
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

  setUnReadMessagesRooms: (item) => set({ unReadMessagesRooms: item }),

  receiveNewMessage: (message) =>
    set((state) => {
      if (!message.roomId) return { rooms: state.rooms }; 
      
      const otherRooms = state.rooms.filter((room) => room.id !== message.roomId);
      const updatedRoom = state.rooms.find((room) => room.id === message.roomId);

      if (!updatedRoom) return { rooms: state.rooms }; 

      return {
        rooms: [
          {
            ...updatedRoom,
            lastMsg: message,
            quantityUnReadMessages: (updatedRoom.quantityUnReadMessages ?? 0) + 1, 
          },
          ...otherRooms,
        ],
      }as Partial<RoomStore>;
    }),
}));

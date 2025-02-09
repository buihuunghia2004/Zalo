import { create } from 'zustand';
import { CursorPaginatedReq, PageOptionsDto } from '~/features/common/pagination/paginationDto';
import { _MessageSentRes } from '~/features/message/dto/message.dto.parent';
import { MessageService } from '~/features/message/messageService';
import { Room } from '~/features/room/dto/room.dto.nested';
import { RoomService } from '~/features/room/roomService';
import { UserBase, UserFriend } from '~/features/user/dto/user.dto.nested';
import { userApi } from '~/features/user/userService';

interface ChatStore {
  messages: _MessageSentRes[];
  pagination: PageOptionsDto;
  member: UserFriend | UserBase | null;
  room: Room | null;
  loadMoreMessage: (dto: CursorPaginatedReq<string>) => Promise<void>;
  fetchMember: (userId: string) => Promise<void>;
  fetchRoom: (roomId: string) => Promise<void>;
  addMessage: (message: _MessageSentRes) => void;
  loadingMore: boolean,
  hasMore: boolean 
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  pagination: { page: 1, limit: 10, total: 0 }, // Khởi tạo giá trị hợp lệ
  member: null,
  room: null,
  loadingMore: false,
  hasMore: true,

  // Fetch danh sách tin nhắn
  loadMoreMessage: async (dto: CursorPaginatedReq<string>) => {
    if (get().loadingMore || !get().hasMore) return;

    set({ loadingMore: true });

    try {      
      const res = await MessageService.loadMoreMessage(dto);
      const newMessages = res.data;

      if (newMessages.length === 0) {        
        set({ hasMore: false }); 
      } else {
        set((state) => ({
          messages: [...state.messages,...res.data ],
          pagination: res.pagination,
        }));
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải tin nhắn:", error);
    } finally {
      set({ loadingMore: false });
    }
  },

  // Fetch thông tin thành viên
  fetchMember: async (userId: string) => {
    try {
      const data = await userApi.findUserById(userId);
      set({ member: data });
    } catch (error) {
      console.error("Lỗi khi tải thông tin thành viên:", error);
    }
  },

  // Fetch thông tin phòng chat
  fetchRoom: async (roomId: string) => {
    try {
      const data = await RoomService.getRoomIdById(roomId);
      set({ room: data });
    } catch (error) {
      console.error("Lỗi khi tải thông tin phòng:", error);
    }
  },

  // Thêm tin nhắn mới vào danh sách
  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },
}));

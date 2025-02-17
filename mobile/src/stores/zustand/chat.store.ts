import {create} from 'zustand';
import {
  CursorPaginatedReq,
  PageOptionsDto,
} from '~/features/common/pagination/paginationDto';
import {
  _MessageSentReq,
  _MessageSentRes,
} from '~/features/message/dto/message.dto.parent';
import {
  MessageContentEnum,
  MessageViewStatus,
} from '~/features/message/dto/message.enum';
import {MessageService} from '~/features/message/messageService';
import {Room} from '~/features/room/dto/room.dto.nested';
import {RoomService} from '~/features/room/roomService';
import {UserBase, UserFriend} from '~/features/user/dto/user.dto.nested';
import {userApi} from '~/features/user/userService';

interface ChatStore {
  messages: _MessageSentRes[];
  pagination: PageOptionsDto;
  member: UserFriend | UserBase | null;
  room: Room | null;
  loadMoreMessage: (dto: CursorPaginatedReq<string>) => Promise<void>;
  fetchMember: (userId: string) => Promise<void>;
  fetchRoom: (roomId: string) => Promise<void>;
  addMessage: (message: _MessageSentRes) => void;
  sendMessage: (
    text: string,
    userId?: string,
    roomId?: string,
  ) => Promise<void>;
  setMessages: (messages: _MessageSentRes[]) => void;
  clearData: () => void;
  loadingMore: boolean;
  hasMore: boolean;
}

const initialState = {
  messages: [],
  pagination: {}, // Khởi tạo giá trị hợp lệ
  member: null,
  room: null,
  loadingMore: false,
  hasMore: true,
};

export const useChatStore = create<ChatStore>((set, get) => ({
  ...initialState,

  // Fetch danh sách tin nhắn
  loadMoreMessage: async (dto: CursorPaginatedReq<string>) => {
    if (get().loadingMore || !get().hasMore) return;

    set({loadingMore: true});

    try {
      const res = await MessageService.loadMoreMessage(dto);
      const {data, pagination} = res;

      if (!pagination?.afterCursor) {
        set({hasMore: false});
      }

      set(state => ({
        messages: [...state.messages, ...data],
        pagination: pagination,
      }));
    } catch (error) {
      console.error('❌ Lỗi khi tải tin nhắn:', error);
    } finally {
      set({loadingMore: false});
    }
  },

  // Fetch thông tin thành viên
  fetchMember: async (userId: string) => {
    try {
      const data = await userApi.findUserById(userId);
      set({member: data});
    } catch (error) {
      console.error('Lỗi khi tải thông tin thành viên:', error);
    }
  },

  // Fetch thông tin phòng chat
  fetchRoom: async (roomId: string) => {
    try {
      const data = await RoomService.getRoomIdById(roomId);
      set({room: data});
    } catch (error) {
      console.error('Lỗi khi tải thông tin phòng:', error);
    }
  },

  sendMessage: async (text: string, userId?: string, roomId?: string) => {
    const msgIdTemp = `temp-${Date.now()}`;

    // Tạo tin nhắn tạm thời
    const tempMessage: _MessageSentRes = {
      id: msgIdTemp,
      content: text,
      isSelfSent: true,
      type: MessageContentEnum.TEXT,
      status: MessageViewStatus.SENDING,
    };

    // Thêm tin nhắn tạm vào danh sách
    get().addMessage(tempMessage);

    // Tạo đối tượng tin nhắn cần gửi
    const newMessage: _MessageSentReq = {
      content: text,
      contentType: MessageContentEnum.TEXT,
      ...(userId && {receiverId: userId}),
      ...(roomId != '' && {roomId: roomId}),
    };

    try {
      // Gửi tin nhắn và nhận phản hồi
      const mesRes = await MessageService.SentMessage(newMessage);
      console.log(mesRes);
      
      // Cập nhật tin nhắn trong danh sách
      set(state => {
        const updatedMessages = state.messages.map(message =>
          message.id === msgIdTemp
            ? {...mesRes, status: 'SENT', isSelfSent: true}
            : message,
        ) as _MessageSentRes[];
        return {messages: updatedMessages};
      });
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
    }
  },

  // Thêm tin nhắn mới vào danh sách
  addMessage: (message: _MessageSentRes) => {
    set(state => ({messages: [message, ...state.messages]}));
  },

  // Cập nhật danh sách tin nhắn
  setMessages: (messages: _MessageSentRes[]) => {
    set({messages});
  },

  // Xóa dữ liệu
  clearData: () => {
    set(() => ({...initialState}));
  },
}));

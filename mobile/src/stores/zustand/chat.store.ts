import {create} from 'zustand';
import {produce} from 'immer';
import {
  CursorPaginatedReq,
  PageOptionsDto,
} from '~/features/common/pagination/paginationDto';
import {
  _MessageSentReq,
  _MessageSentRes,
} from '~/features/message/dto/message.dto.parent';
import {
  MessageContentType,
  MessageViewStatus,
} from '~/features/message/dto/message.enum';
import {MessageService} from '~/features/message/messageService';
import {Room} from '~/features/room/dto/room.dto.nested';
import {RoomService} from '~/features/room/roomService';
import {UserBase, UserFriend} from '~/features/user/dto/user.dto.nested';
import {userApi} from '~/features/user/userService';
import {MessagParente} from '~/features/message/dto/message.dto.nested';

interface ChatStore {
  curentMessageSelected: _MessageSentRes | undefined;
  curentMessageRepling: MessagParente | undefined;
  messages: _MessageSentRes[];
  replyMessages: _MessageSentRes[];
  pagination: PageOptionsDto;
  member: UserFriend | UserBase | null;
  room: Room | null;
  loadMoreMessage: (dto: CursorPaginatedReq<string>) => Promise<void>;
  fetchMember: (userId: string) => Promise<void>;
  fetchRoom: (roomId: string) => Promise<void>;
  addMessage: (message: _MessageSentRes) => void;
  getReplyMessageById: (id: string) => _MessageSentRes | undefined;
  setCurentMessageSelected: (message: _MessageSentRes) => void;
  setCurentMessageRepling: (message: MessagParente) => void;
  sendMessage: (
    text: string,
    replyMessage?: MessagParente | _MessageSentRes,
    userId?: string,
    roomId?: string,
  ) => Promise<void>;
  setMessages: (messages: _MessageSentRes[]) => void;
  clearData: () => void;
  loadingMore: boolean;
  hasMore: boolean;
}

const initialState = {
  curentMessageSelected: undefined,
  curentMessageRepling: undefined,
  messages: [],
  replyMessages: [],
  pagination: {},
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

      set(state => ({
        messages: [...state.messages, ...data],
        pagination: pagination,
      }));
      
      
      if (!pagination?.afterCursor) {
        set({hasMore: false});
      }
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
  getReplyMessageById(id: string) {
    return get().messages.find(message => message.id === id);
  },
  sendMessage: async (
    text: string,
    parentMessage?: MessagParente,
    userId?: string,
    roomId?: string,
  ) => {
    const msgIdTemp = `temp-${Date.now()}`;

    // Tạo tin nhắn tạm thời
    const tempMessage: any = {
      id: msgIdTemp,
      content: text,
      parentMessage: parentMessage,
      isSelfSent: true,
      type: MessageContentType.TEXT,
      createdAt: new Date(),
    };

    // Thêm tin nhắn tạm vào danh sách
    set(
      produce(state => {
        state.messages.unshift(tempMessage);
      }),
    );

    // Tạo đối tượng tin nhắn cần gửi
    const newMessage: _MessageSentReq = {
      content: text,
      contentType: MessageContentType.TEXT,
      ...(parentMessage && {parentMessageId: parentMessage?.id}),
      ...(userId && {receiverId: userId}),
      ...(roomId && {roomId}),
    };

    try {
      // Gửi tin nhắn và nhận phản hồi
      const mesRes = await MessageService.SentMessage(newMessage);

      // Cập nhật tin nhắn đã gửi thành công
      set(
        produce(state => {
          const index = state.messages.findIndex(m => m.id === msgIdTemp);
          if (index !== -1) {
            state.messages[index] = {
              ...mesRes,
              status: MessageViewStatus.SENT,
              isSelfSent: true,
            };
          }
        }),
      );
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
    }
  },

  setCurentMessageSelected: (message: _MessageSentRes) => {
    set({curentMessageSelected: message});
  },

  setCurentMessageRepling: (message: MessagParente) => {
    set({curentMessageRepling: message});
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

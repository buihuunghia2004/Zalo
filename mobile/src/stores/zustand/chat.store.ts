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
  MessageStatus,
} from '~/features/message/dto/message.enum';
import {MessageService} from '~/features/message/messageService';
import {Room} from '~/features/room/dto/room.dto.nested';
import {RoomService} from '~/features/room/roomService';
import {UserBase, UserFriend} from '~/features/user/dto/user.dto.nested';
import {userApi} from '~/features/user/userService';
import {MessageTemp, MessagParente} from '~/features/message/dto/message.dto.nested';
import { DisplayMessage } from '~/features/message/mapper/message.mapper';

interface ChatStore {
  messages: _MessageSentRes[];
  pagination: PageOptionsDto;
  curentMessageRepling: MessagParente | null;
  member: UserFriend | UserBase | null;
  room: Room | null;
  loadMoreMessage: (dto: CursorPaginatedReq<string>) => Promise<void>;
  fetchMember: (userId: string) => Promise<void>;
  fetchRoom: (roomId: string) => Promise<void>;
  addMessage: (message: _MessageSentRes) => void;
  setCurentMessageRepling: (message: MessagParente  | null) => void;
  sentMessage: ( content: string, currentPartnerId: string , currentRoomId: string) => Promise<void>;
  setMessages: (messages: _MessageSentRes[]) => void;
  clearData: () => void;
  loadingMore: boolean;
  hasMore: boolean;
}

const initialState = {
  curentMessageRepling: null,
  messages: [],
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
  sentMessage: async (
    content: string,
    currentPartnerId: string,
    currentRoomId: string
  ) => {    
    const replyMessage = get().curentMessageRepling;
    const msgIdTemp = `temp-${Date.now()}`;
    // Tạo tin nhắn tạm thời
    const tempMessage = {
      id: msgIdTemp,
      content: content,
      isSelfSent: true,
      replyMessage: replyMessage ?? undefined, 
      status: MessageStatus.SENDING,
      type: MessageContentType.TEXT,
      createdAt: new Date(),
    };    
    // Thêm tin nhắn tạm vào danh sách        
    set(produce(state => {state.messages.unshift(tempMessage)}));

    // Tạo đối tượng tin nhắn cần gửi
    const newMessage: _MessageSentReq = {
      content: content,
      contentType: MessageContentType.TEXT,
      ...(replyMessage && {replyMessageId: replyMessage?.id}),
      ...(currentPartnerId && {receiverId: currentPartnerId}),
      ...(currentRoomId && {roomId: currentRoomId}),
    };
    try {
      // Gửi tin nhắn và nhận phản hồi
      const mesRes = await MessageService.SentMessage({dto: newMessage, key: msgIdTemp});
      // Cập nhật tin nhắn đã gửi thành công      
      set(state => ({ messages: state.messages.map(msg => 
        (msg.id === mesRes.key ? mesRes.result : msg)) })
      );

    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
    }
  },
  setCurentMessageRepling: (message) => set({ curentMessageRepling: message }),
  addMessage: (message) => set(state => ({ messages: [message, ...state.messages] })),
  setMessages: (messages) => set({ messages }),
  clearData: () => set(state => ({ ...initialState, curentMessageRepling: state.curentMessageRepling })),
  
}));

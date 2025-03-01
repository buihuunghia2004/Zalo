import MessageRepository from '~/database/repositories/MessageRepository';
import { _MessageSentRes } from '~/features/message/dto/message.dto.parent';

// Đồng bộ dữ liệu từ API (array messages)
export const syncMessagesToDB = async (messages: _MessageSentRes[]): Promise<void> => {
  await MessageRepository.saveMessages(messages, false); // Xóa dữ liệu cũ
};

// Đồng bộ dữ liệu từ socket (single message)
export const syncMessageFromSocket = async (message: _MessageSentRes): Promise<void> => {
  await MessageRepository.saveMessages([message], true); // Chỉ thêm mới
};

// Lấy dữ liệu theo roomId (tuỳ chọn)
export const loadMessagesByRoomId = async (roomId: string): Promise<_MessageSentRes[]> => {
  return await MessageRepository.getMessagesByRoomId(roomId);
};
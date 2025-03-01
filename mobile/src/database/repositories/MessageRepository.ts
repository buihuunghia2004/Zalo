import { database } from '~/database';
import { Q } from '@nozbe/watermelondb';
import { _MessageSentRes } from '~/features/message/dto/message.dto.parent';
import { compressData, decompressData } from '~/utils/compression';
import { MessageContentType, MessageStatus } from '~/features/message/dto/message.enum';
import { LastMsg, MemberResDto } from '~/features/room/dto/room.dto.nested';
import Message from '../models/Message';
import { UserEntity } from '~/features/user/userEntity';

class MessageRepository {
  private messagesCollection = database.get<Message>('messages');

  // Lưu danh sách tin nhắn vào database (dùng cho API hoặc socket)
  async saveMessages(messages: _MessageSentRes[], appendOnly: boolean = false) {
    await database.write(async () => {
      // Nếu không phải appendOnly (dùng cho API), xóa dữ liệu cũ
      if (!appendOnly) {
        const allMessages = await this.messagesCollection.query().fetch();
        await Promise.all(allMessages.map((msg) => msg.destroyPermanently()));
      }

      // Nén và lưu tin nhắn
      const compressedMessages = messages.map((msg) => ({
        ...msg,
        content: compressData(msg.content),
        createdAt: msg.createdAt instanceof Date ? msg.createdAt.getTime() : msg.createdAt, // Chuyển Date thành number nếu cần
      }));

      for (const msg of compressedMessages) {
        const existingMsg = await this.messagesCollection
          .query(Q.where('id', msg.id))
          .fetch();

        if (existingMsg.length === 0) {
          await this.messagesCollection.create((message) => {
            message._raw.id = msg.id;
            message.content = msg.content; // Đã nén
            message.type = msg.type;
            message.senderId = msg.senderId;
            message.roomId = msg.roomId;
            message.status = MessageStatus.SENT;
            message.replyMessageId = msg.replyMessageId;
            message.revoked = msg.revoked;
            message.createdAt = msg.createdAt; // number
          });
        }
      }
    });
  }

  // Lấy danh sách tin nhắn theo roomId
  async getMessagesByRoomId(roomId: string): Promise<_MessageSentRes[]> {
    const messages = await this.messagesCollection
      .query(Q.where('room_id', roomId), Q.sortBy('created_at', Q.desc))
      .fetch();

    return messages.map((msg) => ({
      id: msg.id,
      content: decompressData(msg.content),
      subContent: msg.subContent,
      type: msg.type as MessageContentType,
      senderId: msg.senderId,
      roomId: msg.roomId,
      replyMessageId: msg.replyMessageId,
      revoked: msg.revoked,
      createdAt: new Date(msg.createdAt), // Chuyển number thành Date
    }));
  }
}

export default new MessageRepository();
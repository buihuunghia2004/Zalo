import { _MessageSentRes } from '~/features/message/dto/message.dto.parent';
import { MessageStatus } from '~/features/message/dto/message.enum';
import { Room } from '~/features/room/dto/room.dto.nested';
import { UserBase, UserFriend } from '~/features/user/dto/user.dto.nested';

export type DisplayMessage = _MessageSentRes & {
  isDisplayTime?: boolean;
  isDisplayHeart?: boolean;
  isDisplayAvatar?: boolean;
  isDisplayStatus?: boolean;
  messageStatus: MessageStatus;
};
export const mapMessagesToDisplay = (
  messages: _MessageSentRes[],
  room: Room | null,
  meId: string 
): DisplayMessage[] => {
  if (!messages?.length) return [];

  return messages.map((message, index, array) => {
    let status = message.status ?? MessageStatus.SENT;
    const isSelfSent = message.isSelfSent;
    
    room?.members?.find(member => {
      if (member.user.id !== meId) {
        if (member.msgVTime > message?.createdAt) {
          status = MessageStatus.VIEWED;
          return true; // Thoát vòng lặp sớm
        }
        if (member.msgRTime > message?.createdAt) {
          status = MessageStatus.RECEIVED;
        }
      }
      return false;
    });

    return {
      ...message,
      isSelfSent,
      messageStatus: status,
      isDisplayHeart: !isSelfSent && (array[index - 1]?.isSelfSent || index === 0),
      isDisplayAvatar: !isSelfSent && array[index + 1]?.isSelfSent,
      isDisplayStatus: isSelfSent && index === 0,
       // isDisplayTime:
        //   index === array.length - 1 ||
        //   (message.source !== array[index + 1]?.source &&
        //     message.source !== 'time' &&
        //     message.source !== 'action'),

        // isDisplayHeart:
        //   message.source === 'people' &&
        //   message.source !== array[index + 1]?.source,
    };
  });
};

import { MessageContentEnum, MessageViewStatus } from "./dto/message.enum";

export interface messageEntity {
    id: string;
    senderId: string;
    roomId: string;
    content: string;
    subContent?: string;
    type: MessageContentEnum;
    replyMessageId?: string;
    status: MessageViewStatus;
};



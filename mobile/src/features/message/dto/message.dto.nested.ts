import { MessageContentType, MessageViewStatus } from './message.enum';

export interface MessageBase {
  id: string;
  content: string;
  isSelfSent: boolean;
  type: MessageContentType;
  status: MessageViewStatus;
}
export interface MessagParente {
  id: string;
  content: string;
  type: MessageContentType;
  createdAt: Date;
}

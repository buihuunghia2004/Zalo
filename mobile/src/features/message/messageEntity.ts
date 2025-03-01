import { MemberResDto } from "../room/dto/room.dto.nested";
import { RoomEntity } from "../room/roomEntity";
import { MessagParente } from "./dto/message.dto.nested";
import {  MessageContentType } from "./dto/message.enum";

export interface messageEntity {
    id: string;
    senderId: string;
    roomId: string;
    content: string;
    subContent?: string;
    type: MessageContentType;
    revoked: boolean;
    sender: MemberResDto,
    room: RoomEntity,
    replyMessage?: MessagParente;
    createdAt: Date
};



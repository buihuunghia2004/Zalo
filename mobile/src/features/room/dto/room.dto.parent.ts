import { Room } from "./room.dto.nested";
import { CursorPaginatedRes } from "~/features/common/pagination/paginationDto";

export interface _GetAllRoomRes extends CursorPaginatedRes<Room[]>{}

export interface _GetRoomRes extends Room{}

export interface _GetRoomIdByUserIdRes {
    roomId: string
} 



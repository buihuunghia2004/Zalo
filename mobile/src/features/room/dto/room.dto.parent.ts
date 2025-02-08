import { Room } from "./room.dto.nested";
import { ApiResHasPagination, PaginationRes } from "~/features/common/pagination/paginationDto";

export interface _GetAllRoomRes extends ApiResHasPagination<Room[]>{}

export interface _GetRoomRes extends Room{}

export interface _GetRoomIdByUserIdRes {
    roomId: string
} 



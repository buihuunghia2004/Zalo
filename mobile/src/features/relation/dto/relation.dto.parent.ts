import { RelationAction, RelationStatus } from "./relation.dto.enum"
import { Relation } from "./relation.dto.nested"

export interface _SendRequestReq {
    receiverId: string
}
export interface _SendRequestRes {
    id: string,
    requesterId: string,
    handlerId: string,
    status: RelationStatus,
    createdAt: Date,
    updatedAt: Date
}


export interface _HandleRequestReq {
    relationId: string,
    action: RelationAction 
}
export interface _HandleRequestRes extends _SendRequestRes {}
    
import {  UserBase } from "~/features/user/dto/user.dto.nested";
import { InviterTypeEnum } from "~/features/user/dto/user.enum";
import { RelationStatus } from "./relation.dto.enum";

export interface Relation{
    id: string,
    status: RelationStatus,
    user: UserBase,
    inviter: InviterTypeEnum
    createdAt: Date
}
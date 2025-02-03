import { Uuid } from "@/common/types/common.type";
import { ClassField, StringFieldOptional } from "@/decorators/field.decorators";
import { ArrayMinSize, IsUUID } from "class-validator";

export class CreateGroupReqDto {
  @StringFieldOptional()
  groupName?: string

  @StringFieldOptional()
  groupAvatar?: string

  @ArrayMinSize(2)
  @IsUUID('all', { each: true }) 
  userIds: Uuid[]
}

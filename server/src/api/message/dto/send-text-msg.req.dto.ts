import { Uuid } from "@/common/types/common.type";
import { StringField, UUIDFieldOptional } from "@/decorators/field.decorators";

export class SendTextMsgReqDto {
  @StringField()
  content: string

  @UUIDFieldOptional()
  replyMessageId: Uuid
}

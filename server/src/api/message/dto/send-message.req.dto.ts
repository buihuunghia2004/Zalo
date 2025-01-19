import { Uuid } from "@/common/types/common.type";
import { MessageContentType } from "@/constants/entity.enum";
import { EnumFieldOptional, StringFieldOptional, UUIDFieldOptional } from "@/decorators/field.decorators";

export class SendMessageReqDto {
  @UUIDFieldOptional()
  receiverId?: Uuid

  @UUIDFieldOptional()
  roomId?: Uuid

  @StringFieldOptional()
  content?: string

  @UUIDFieldOptional()
  replyMessageId: Uuid

  @EnumFieldOptional(()=>MessageContentType)
  contentType: MessageContentType
}

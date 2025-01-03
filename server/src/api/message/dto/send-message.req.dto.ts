import { Uuid } from "@/common/types/common.type";
import { MessageContentType } from "@/constants/entity.enum";
import { EnumField, StringField, UUIDField, UUIDFieldOptional } from "@/decorators/field.decorators";

export class SendMessageReqDto {
  @UUIDFieldOptional()
  receiverId?: Uuid

  @UUIDFieldOptional()
  roomId?: Uuid

  @StringField()
  content: string

  @EnumField(()=>MessageContentType)
  contentType: MessageContentType
}

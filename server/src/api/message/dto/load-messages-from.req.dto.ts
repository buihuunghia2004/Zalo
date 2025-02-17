import { PageOptionsDto } from '@/common/dto/cursor-pagination/page-options.dto';
import { StringField, StringFieldOptional } from '@/decorators/field.decorators';

export class LoadMessagesFromReqDto extends PageOptionsDto {
  @StringField()
  roomId!: string;
  
  @StringFieldOptional()
  messageId: string;
}

import { PageOptionsDto } from '@/common/dto/cursor-pagination/page-options.dto';
import { StringField } from '@/decorators/field.decorators';

export class LoadMoreMessagesReqDto extends PageOptionsDto {
  @StringField()
  roomId!: string;
}

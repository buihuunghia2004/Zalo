import { DateFieldOptional, EnumFieldOptional, StringField, StringFieldOptional } from '@/decorators/field.decorators';
import { Gender } from '@/constants/entity.enum';

export class UpdateUserReqDto{
  @StringFieldOptional()
  username: string;

  @EnumFieldOptional(()=>Gender)
  gender?: Gender;

  @DateFieldOptional()
  dob?: Date
}
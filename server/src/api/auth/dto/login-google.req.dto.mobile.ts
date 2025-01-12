import {  StringField } from '@/decorators/field.decorators';

export class LoginWithGoogleReqMobileDto {
  @StringField()
  idToken!: string;
}

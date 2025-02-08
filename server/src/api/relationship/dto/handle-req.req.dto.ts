import { Uuid } from '@/common/types/common.type';
import { RelationAction } from '@/constants/entity-enum/relation.enum';
import {
  EnumField,
  UUIDField,
} from '@/decorators/field.decorators';

export enum ActionHanleRequestRelation{
  ACCEPT = 'accept',
  REJECT = 'reject',
  REVOKE = 'revoke',
}

export class HandleRequestToAddFriendReqDto {
  @UUIDField()
  relationId: Uuid

  @EnumField(()=> RelationAction)
  action: RelationAction

  
}

import { Uuid } from '@/common/types/common.type';
import { RelationAction } from '@/constants/entity-enum/relation.enum';
import {
  EnumField,
  UUIDField,
} from '@/decorators/field.decorators';

export class HandleRequestToAddFriendReqDto {
  @UUIDField()
  relationId: Uuid

  @EnumField(()=> RelationAction)
  action: RelationAction

  
}

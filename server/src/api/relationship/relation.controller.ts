import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { RelationService } from './relation.service';
import { SendRequestToAddFriendReqDto } from './dto/send-request.req.dto';
import { HandleRequestToAddFriendReqDto } from './dto/handle-req.req.dto';
import { Uuid } from '@/common/types/common.type';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { GetListRelationReqDto } from './dto/get-list.req.dto';

@ApiTags('relations')
@Controller({
  path: 'relations',
  version: '1',
})
export class RelationController {
  constructor(private readonly relationService: RelationService) {}

  @Post('/sent-request')
  sendRequest(
    @Body() {receiverId}: {receiverId: Uuid},
    @CurrentUser('id') myId: Uuid
  ) {
    return this.relationService.sendRequest(myId, receiverId);
  }
  
  @Post('/handle-request')
  handleRequest(@Body() dto: HandleRequestToAddFriendReqDto) {
    return this.relationService.handleRequest(dto);
  }

  @Get()
  findAll(
    @CurrentUser('id') userId: Uuid,
    @Query() {status}: GetListRelationReqDto
  ) {
    return this.relationService.getAllRelations(userId, status);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.friendService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
  //   return this.friendService.update(+id, updateFriendDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: Uuid) {
    console.log('id',id);
    
    return this.relationService.deleteRelation(id);
  }
}

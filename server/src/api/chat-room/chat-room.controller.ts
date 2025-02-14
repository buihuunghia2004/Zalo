import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { ApiTags } from '@nestjs/swagger';
import { ListRoomReqDto } from './dto/list-room.req.dto';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { Uuid } from '@/common/types/common.type';
import { CreateGroupReqDto } from './dto/create-group.req.dto';

@ApiTags('rooms')
@Controller({
  version:'1',
  path:'rooms'
})
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Post('/groups')
  create(
    @Body() dto: CreateGroupReqDto,
    @CurrentUser('id') id: Uuid,
  ) {
    return this.chatRoomService.createGroupRoom(dto, id);
  }

  @Get()
  findAll(
    @Query() reqDto: ListRoomReqDto,
    @CurrentUser('id') meId: Uuid
  ) {
    return this.chatRoomService.findAll(reqDto, meId);
  }
  
  @Get('/groups')
  getAllGroups(
    @Query() reqDto: ListRoomReqDto,
    @CurrentUser('id') meId: Uuid
  ) {
    return this.chatRoomService.findAllGroups(reqDto, meId);
  }

  @Get('/partner/:id')
  findOneByPartnerId(
    @Param('id') id: Uuid,
    @CurrentUser('id') meId: Uuid
  ) {
    return this.chatRoomService.findOneByPartnerId(meId, id);
  }

  @Get(':id')
  findOne(
    @Param('id') roomId: Uuid,
    @CurrentUser('id') meId: Uuid
  ) {
    return this.chatRoomService.findOne(roomId, meId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatRoomDto: UpdateChatRoomDto) {
    return this.chatRoomService.update(+id, updateChatRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatRoomService.remove(+id);
  }
}

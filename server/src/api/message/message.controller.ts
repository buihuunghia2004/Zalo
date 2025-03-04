import { Controller, Get, Post, Body, Param, Delete, Query, UseInterceptors, BadRequestException, UploadedFile, Put } from '@nestjs/common';
import { MessageService } from './message.service';
import { ApiTags } from '@nestjs/swagger';
import { SendMessageReqDto } from './dto/send-message.req.dto';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { Uuid } from '@/common/types/common.type';
import { CursorPaginatedDto } from '@/common/dto/cursor-pagination/paginated.dto';
import { LoadMoreMessagesReqDto } from './dto/load-more-messages.req.dto';
import { MessageResDto } from './dto/message.res.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SendTextMsgReqDto } from './dto/send-text-msg.req.dto';
import { LoadMessagesFromReqDto } from './dto/load-messages-from.req.dto';
@ApiTags('messages')
@Controller({
    path: 'messages',
    version: '1',
})
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file',{
      limits: { fileSize: 500 * 1024 },
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(new BadRequestException('Invalid file type'), false);
        }
        callback(null, true);
      },
    })
  )
  sendMessage(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: SendMessageReqDto,
    @CurrentUser('id') id: Uuid
  ) {
    return this.messageService.sendMessage(dto, file, id);
  }

  @Post(':roomId/text')
  sendTextMsg(
    @Param('roomId') roomId: Uuid,
    @Body() dto: SendTextMsgReqDto,
    @CurrentUser('id') id: Uuid
  ) {
    return this.messageService.sendTextMsg(roomId, dto, id);
  }

  @Put(':id')
  revokeMessage(@Param('id') id: Uuid) {
    return this.messageService.revokeMessage(id)
  }

  @Get()
  findAll(
    @Query() reqDto: LoadMoreMessagesReqDto,
    @CurrentUser('id') meId: Uuid
  ): Promise<CursorPaginatedDto<MessageResDto>> {
    
    return this.messageService.loadMoreMessage(reqDto, meId);
  }

  @Get('from')
  loadMessagesFrom(
    @Query() reqDto: LoadMessagesFromReqDto,
    @CurrentUser('id') meId: Uuid
  ): Promise<CursorPaginatedDto<MessageResDto>> {
    
    return this.messageService.loadMessageFrom(reqDto, meId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
  //   return this.messageService.update(+id, updateMessageDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}

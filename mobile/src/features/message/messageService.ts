import axiosInstance from '~/configs/axiosInstance';
import {_MessageSentReq, _MessageSentRes} from './dto/message.dto.parent';
import { CursorPaginatedReq, CursorPaginatedRes } from '../common/pagination/paginationDto';

const loadMoreMessage= async (dto: CursorPaginatedReq<string>): Promise<CursorPaginatedRes<_MessageSentRes>> => {
  try {
    let query = `roomId=${dto.data}`  

    const afterCursor = dto.pagination.afterCursor
    const beforeCursor = dto.pagination.beforeCursor  

    if (afterCursor) query += `&afterCursor=${afterCursor}`
    if (beforeCursor) query += `&beforeCursor=${afterCursor}`         
      
    return await axiosInstance.get('/messages?'+query)
  } catch (error) {
    console.error('Lỗi khi tải thêm tin nhắn:', error);
    throw error;
  }
}

import { AxiosResponse } from 'axios';

const SentMessage = async ({ dto, key }: { dto: _MessageSentReq, key: string })
: Promise<{ result: _MessageSentRes, key: string }> => {
  try {
    const res = (await axiosInstance.post(`messages/${dto.roomId}/text`, dto));
    return { result: res.data, key };
  } catch (error: any) {
    console.error('Error while sending message:', error);
    throw error;
  }
};


export const MessageService = {
  loadMoreMessage,
  SentMessage,
}
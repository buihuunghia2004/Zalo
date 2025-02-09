import axiosInstance from '~/configs/axiosInstance';
import {_MessageSentReq, _MessageSentRes} from './dto/message.dto.parent';
import { CursorPaginatedReq, CursorPaginatedRes } from '../common/pagination/paginationDto';

const loadMoreMessage= async (dto: CursorPaginatedReq<string>): Promise<CursorPaginatedRes<_MessageSentRes>> => {
  try {
    let query = `roomId=${dto.data}`    
    if (dto.pagination.afterCursor) {
      query += `&afterCursor=${dto.pagination.afterCursor}`
    }        
      
    return await axiosInstance.get('/messages?'+query)
  } catch (error) {
    console.error('Lỗi khi tải thêm tin nhắn:', error);
    throw error;
  }
}

const SentMessage = async (dto: _MessageSentReq): Promise<_MessageSentRes> => {
  try {
    return await axiosInstance.post('messages', dto);;
  } catch (error: any) {
    console.error('Error while searching user:', error);
    throw error;
  }
};

export const MessageService = {
  loadMoreMessage,
  SentMessage,
}
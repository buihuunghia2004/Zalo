import axiosInstance from '~/configs/axiosInstance';
import {_MessageLoadRes, _MessageSentReq, _MessageSentRes} from './dto/message.dto.parent';

const loadMessages = async (roomId: string): Promise<_MessageLoadRes> => {
  try {
    const res = await axiosInstance.get('messages',{
      params: {roomId: roomId},
    });
    return res.data;
  } catch (error: any) {
    console.error('Error while searching user:', error);
    throw error;
  }
};

const SentMessage = async (dto: _MessageSentReq): Promise<_MessageSentRes> => {
  try {
    const res = await axiosInstance.post('messages', dto);

    return res.data;
  } catch (error: any) {
    console.error('Error while searching user:', error);
    throw error;
  }
};

export const MessageService = {
  loadMessages,
  SentMessage,
}
import axiosInstance from '~/configs/axiosInstance';
import {_MessageLoadRes, _MessageSentReq, _MessageSentRes} from './dto/message.dto.parent';

const loadMessages = async (roomId: string): Promise<_MessageLoadRes> => {
  console.log(roomId);
  
  try {
    // return await axiosInstance.get('messages',{
    //   params: {roomId: roomId},
    // });
    if (roomId) {
      return await axiosInstance.get(`messages?roomId=${roomId}`);
    }
    return axiosInstance.get('')
  } catch (error: any) {
    console.error('Error while searching user:', error);
    throw error;
  }
};

const SentMessage = async (dto: _MessageSentReq): Promise<_MessageSentRes> => {
  try {
    return await axiosInstance.post('messages', dto);;
  } catch (error: any) {
    console.error('Error while searching user:', error);
    throw error;
  }
};

export const MessageService = {
  loadMessages,
  SentMessage,
}
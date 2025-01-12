import axiosInstance from '~/configs/axiosInstance';
import { SendRequestReq } from '~/features/relation/relationDto';

const sendRequest = async (dto: SendRequestReq) => {
  try {
    const response = await axiosInstance.post(
      'relations/sent-request',
      {
        receiverId: dto.receiverId,
      }
    );
    console.log(response);
    return response.data; 
  } catch (error: any) {
    console.error('Error sending request:', error);
  }
};

// const handleRequest = async (dto: handleRequestReq) => {

export const relationApi = {
  sendRequest,
};

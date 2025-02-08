import axiosInstance from '~/configs/axiosInstance';
import {_GetAllRoomRes, _GetRoomIdByUserIdRes, _GetRoomRes} from './dto/room.dto.parent';

const getAllRoom = async (): Promise<_GetAllRoomRes> => {
  try {
    const res = await axiosInstance.get('rooms');
    return res.data;
  } catch (error: any) {
    console.error('Error while searching user:', error);
    throw error;
  }
};

const findOneByPartnerId = async (userId: string): Promise<_GetRoomIdByUserIdRes> => {
  return await axiosInstance.get('rooms/partner/'+userId )
};

const getRoomIdById = async (roomId: string): Promise<_GetRoomRes> => {
  console.log('rooomId'+ roomId);
  
  try {    
    return await axiosInstance.get('rooms/'+roomId)
  } catch (error: any) {
    throw error;
  }
}

export const RoomService = {
  getAllRoom,
  getRoomIdById,
  findOneByPartnerId
};
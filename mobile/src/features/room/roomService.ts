import axiosInstance from '~/configs/axiosInstance';
import {_GetAllRoomRes, _GetRoomIdByUserIdRes} from './dto/room.dto.parent';

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
  try {
    const res = await axiosInstance.get('rooms/partner/', {
      params: { id: userId },
    });
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const RoomService = {
  getAllRoom,
  findOneByPartnerId
};
import axiosInstance from '~/configs/axiosInstance';
import {_GetAllRoomRes, _GetRoomIdByUserIdRes, _GetRoomRes} from './dto/room.dto.parent';
import { Room } from './dto/room.dto.nested';

const getAllRooms = async (): Promise<Room[]> => {
  try {  
    const res = await axiosInstance.get('rooms');      
    return res.data
  } catch (error: any) {
    console.error('Error get All room', error);
    throw error;
  }
};

const findOneByPartnerId = async (userId: string): Promise<_GetRoomIdByUserIdRes> => {
  return await axiosInstance.get('rooms/partner/'+userId )
};

const getRoomIdById = async (roomId: string): Promise<_GetRoomRes> => {
  try {    
    return await axiosInstance.get('rooms/'+roomId)
  } catch (error: any) {
    throw error;
  }
}

export const RoomService = {
  getAllRooms,
  getRoomIdById,
  findOneByPartnerId
};
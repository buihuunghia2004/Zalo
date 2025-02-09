import axiosInstance from '~/configs/axiosInstance';
import { UserSearchRes } from './dto/user.dto.parent';
import { UserFriend } from './dto/user.dto.nested';

const searchUserByEmail = async (email: string): Promise<UserSearchRes> => {
  try {    
    return await axiosInstance.get('users/search', {
      params: { email: email },
    }); ; 
  } catch (error: any) {
    console.error('Error while searching user:', error);
    throw error; 
  }
};

const getAllFriends = async (): Promise<UserFriend[]> => {
  try {    
    return await axiosInstance.get('users'); 
  } catch (error: any) {
    console.error('Error while searching user:', error);
    throw error; 
  }
};
const findUserById = async (id: string): Promise<UserFriend> => {
  try {    
    return await axiosInstance.get(`users/${id}`);
  } catch (error: any) {
    console.error('Error while searching user:', error);
    throw error; 
  }
}
export const userApi = { 
  searchUserByEmail ,
  getAllFriends,
  findUserById
};

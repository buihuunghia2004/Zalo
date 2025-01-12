import axiosInstance from '~/configs/axiosInstance';
import { UserSearchRes } from './userDto';

const searchUserByEmail = async (email: string): Promise<UserSearchRes> => {
  try {    
    const res = await axiosInstance.get('users/search', {
      params: { email: email },
    });
    console.log(res.data.user);
    
    return res.data.user; 
  } catch (error: any) {
    console.error('Error while searching user:', error);
    throw error; 
  }
};

export const userApi = { 
  searchUserByEmail 
};

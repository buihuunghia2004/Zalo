import axiosInstance from '~/configs/axiosInstance';
import {loginSuccess, loginFailure, loginStart, logout} from './authSlice';
import {AppDispatch} from '~/stores/redux/store';
import localStorage from '~/utils/localStorage';
import {loginGoogleRequest, loginGoogleResponse} from './authDto';
import {ACCESS_TOKEN, AUTH_ASYNC_STORAGE_KEY} from '~/utils/Constants/authConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export const loginUser =
  (req: LoginCredentials) => async (dispatch: AppDispatch) => {
    dispatch(loginStart());
    try {
      const response: loginGoogleResponse = await axiosInstance.post(
        'auth/client/login',
        req,
      );

      handleLoginSuccess(dispatch, response);
    } catch (error: any) {
      dispatch(loginFailure(error.response?.data?.message || 'Login failed'));
    }
  };

export const loginWithGoogle =
  (req: loginGoogleRequest) => async (dispatch: AppDispatch) => {
    dispatch(loginStart());
    try {      
      const response: loginGoogleResponse = await axiosInstance.post(
        'auth/google-mobile',
        req,
      ); 
      
      handleLoginSuccess(dispatch, response);
    } catch (error: any) {      
      dispatch(
        loginFailure(
          error.response?.data?.message || 'Login with Google failed',
        ),
      );
    }
  };

export const registerUser =
  (registerCredentials: RegisterCredentials) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await axiosInstance.post(
        '/auth/client/register',
        registerCredentials,
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Registration failed';
      console.error('Error during registration:', errorMessage);
      dispatch(loginFailure(errorMessage));
    }
  };

export const logoutUser = () => (dispatch: AppDispatch) => {
  try {
    localStorage.removeItem(ACCESS_TOKEN);
    dispatch(logout());
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

const handleLoginSuccess = async(
  dispatch: AppDispatch,
  response: loginGoogleResponse,
): Promise<void> => {  
  dispatch(loginSuccess(response));
  
  await AsyncStorage.setItem(
    AUTH_ASYNC_STORAGE_KEY,
    JSON.stringify(response)
  );
};

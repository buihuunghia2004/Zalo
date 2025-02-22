
import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { useSelector } from 'react-redux';
import { authSelector } from '~/features/auth/authSlice';
import store from '~/stores/redux/store';
import {ACCESS_TOKEN} from '~/utils/Constants/authConstant';
import localStorage from '~/utils/localStorage';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.10:7777/api/v1/',//pham thi thi 5g
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessTokenFast = '';

export const setAuthorizationToken = (token: string) => {
  accessTokenFast = token;  
};

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { accessToken } = store .getState().auth;
    if (accessTokenFast) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }else{
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.log('Request Error:', error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {    
    return response.data;
  },
  async (error: AxiosError) => {
    console.log('Response Error:', error);
    if (error.response?.status === 401) {
      await localStorage.removeItem(ACCESS_TOKEN);
      console.log('Token expired. Please login again.');
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

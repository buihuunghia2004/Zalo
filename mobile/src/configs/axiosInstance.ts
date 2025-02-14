import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import {ACCESS_TOKEN} from '~/utils/Constants/authConstant';
import localStorage from '~/utils/localStorage';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.19:7777/api/v1/',//pham thi thi 5g
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessToken = '';

export const setAuthorizationToken = (token: string) => {
  accessToken = token;  
};

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (accessToken) {      
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

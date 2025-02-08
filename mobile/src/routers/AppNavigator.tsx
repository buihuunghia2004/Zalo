import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './main/MainNavigator';

import {SplashScreen} from '~/screens/SplashScreen';
import {AUTH_ASYNC_STORAGE_KEY} from '~/utils/Constants/authConstant';
import {useAuthDispatch, useAuthSelector} from '~/stores/redux/store';
import {setAuth, authSelector} from '~/features/auth/authSlice';
import {loginGoogleResponse} from '~/features/auth/authDto';
import { setAuthorizationToken } from '~/configs/axiosInstance';


const AppRouters = () => {
  const authData = useAuthSelector(authSelector);
  const dispatch = useAuthDispatch();

  const [isShowSplash, setIsShowSplash] = useState(true);

  const {getItem} = useAsyncStorage(AUTH_ASYNC_STORAGE_KEY);

  useEffect(() => {

    checkLogin();
    const timeout = setTimeout(() => {
      setIsShowSplash(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const checkLogin = async () => {
    const auth = await getItem();
    
    if (auth) {      
      const parsedAuth = JSON.parse(auth) as loginGoogleResponse;   
      dispatch(setAuth(parsedAuth));
      setAuthorizationToken(parsedAuth.accessToken)
    }
  };

  return (
    <>
      {isShowSplash ? (
        <SplashScreen />
      ) : authData?.accessToken ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
      )}
    </>
  );
};

export default AppRouters;

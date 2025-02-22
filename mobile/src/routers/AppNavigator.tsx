import {userApi} from '~/features/user/userService';
import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage';
import {SplashScreen} from '~/screens/SplashScreen';
import {SocketProvider} from '~/socket/SocketProvider';
import {useEffect, useState} from 'react';
import {loginGoogleResponse} from '~/features/auth/authDto';
import {setAuthorizationToken} from '~/configs/axiosInstance';
import {setAuth, authSelector, setMe} from '~/features/auth/authSlice';
import {useAuthDispatch, useAuthSelector} from '~/stores/redux/store';
import {
  AUTH_ASYNC_STORAGE_KEY,
  ME_ASYNC_STORAGE_KEY,
} from '~/utils/Constants/authConstant';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './main/MainNavigator';
import {UserEntity} from '~/features/user/userEntity';
import useSocketEvent from '~/hooks/useSocket ';

const AppRouters = () => {
  
  const authData = useAuthSelector(authSelector);
  const dispatch = useAuthDispatch();

  const [isShowSplash, setIsShowSplash] = useState(true);

  const {getItem: getAuth} = useAsyncStorage(AUTH_ASYNC_STORAGE_KEY);
  const {getItem: getMe} = useAsyncStorage(ME_ASYNC_STORAGE_KEY);

  useEffect(() => {
    checkLogin();
    const timeout = setTimeout(() => {
      setIsShowSplash(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);
  const checkLogin = async () => {
    const auth = await getAuth();
    const me = await getMe();

    if (auth) {
      const parsedAuth = JSON.parse(auth) as loginGoogleResponse;
      setAuthorizationToken(parsedAuth.accessToken);
      dispatch(setAuth(parsedAuth));
    }
    if (me) {
      const parsedMe = JSON.parse(me) as UserEntity;
      dispatch(setMe(parsedMe));
    } else {
      const me = await userApi.getCurrentUser();
      dispatch(setMe(me));
      await AsyncStorage.setItem(ME_ASYNC_STORAGE_KEY, JSON.stringify(me));
    }
  };

  return (
    <>
      {isShowSplash ? (
        <SplashScreen />
      ) : authData?.accessToken ? (
        <SocketProvider namespace={'message'}>
          <MainNavigator />
        </SocketProvider>
      ) : (
        <AuthNavigator />
      )}
    </>
  );
};

export default AppRouters;

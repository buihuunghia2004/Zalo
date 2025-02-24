import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { appReducer } from '~/features/app/appSlice';
import { authReducer } from '~/features/auth/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAuthDispatch = () => useDispatch<AppDispatch>();
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAuthSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export default store;

// src/features/auth/authSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {UserEntity} from '../user/userEntity';

interface AppState {
  meData: UserEntity | null;
  currentPartnerId: string | null; 
  currentRoomId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AppState = {
  meData: null,
  currentPartnerId: null,
  currentRoomId: null,
  isLoading: false,
  error: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    resetCurrentRoomId: (state, action: PayloadAction<string | null>) => {
      state.currentRoomId = action.payload;
    },
    resetCurrentUserId: (state, action: PayloadAction<string>) => {
      state.currentRoomId = action.payload;
    },
    leaveRoom: state => {
      state.currentRoomId = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setMe: (state,action: PayloadAction<UserEntity>) => {      
      state.meData = action.payload      
    }
  },
});

export const {resetCurrentRoomId, resetCurrentUserId, leaveRoom, setLoading, setMe} = appSlice.actions;
export const appReducer = appSlice.reducer;
export const appSelector = (state: {app: AppState}) => state.app;

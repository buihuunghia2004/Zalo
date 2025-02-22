import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authAPI from '../../service/authAPI';
import { AppConstant } from '../../constants/appConstant';

export const logout = createAsyncThunk(
  'auth/logout',
  async (_,{rejectWithValue }) => {
    try {
      return await authAPI.logoutAPI()
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken:null,
    refreshToken:null,
    expires:null,
  },
  reducers: {
    setAuth: (state, action) => {            
      const {accessToken, refreshToken, expires} = action.payload
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      state.expires = expires
      localStorage.setItem(AppConstant.LOCAL_STORAGE_ACCESS_TOKEN_KEY, accessToken)
      localStorage.setItem(AppConstant.LOCAL_STORAGE_REFRESH_TOKEN_KEY, refreshToken)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state, action) => {
      state.accessToken = null
      state.refreshToken = null
      state.expires = null
      localStorage.removeItem(AppConstant.LOCAL_STORAGE_ACCESS_TOKEN_KEY);
    })
  }
});

export const { setAuth } = authSlice.actions;

export default authSlice.reducer;

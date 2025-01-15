import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userAPI from '../../service/userAPI';
import authAPI from '../../service/authAPI';
import { AppConstant } from '../../constants/appConstant';

const updateMe = createAsyncThunk(
  'users/updateMe',
  async (data, {rejectWithValue}) => {
    try {
      return await userAPI.updateMe(data)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const getMe = createAsyncThunk(
  'users/getMe',
  async (_,{rejectWithValue }) => {
    try {
      const response = await userAPI.getMe()
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

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

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user:{},
    auth:{}
  },
  reducers: {
    setAuth: (state, action) => {            
      state.auth.accessToken = action.payload.accessToken
      state.auth.refreshToken = action.payload.refreshToken
      state.auth.expires = action.payload.expires
      localStorage.setItem(AppConstant.LOCAL_STORAGE_ACCESS_TOKEN_KEY,action.payload.accessToken)
      localStorage.setItem(AppConstant.LOCAL_STORAGE_REFRESH_TOKEN_KEY,action.payload.refreshToken)
    },

    setMeInfo: (state, action) => {
      state.user.id = action.payload.id
      state.user.avatarUrl = action.payload.avatarUrl
      state.user.avatarPid = action.payload.avatarPid
      state.user.bio = action.payload.bio
      state.user.email = action.payload.email
    }
  },
  extraReducers: (builder) => {
    builder.addCase(updateMe.fulfilled, (state, action) => {
      state.user = action.payload
    }),
    builder.addCase(getMe.fulfilled, (state, action) => {
      state.user = action.payload
    }),
    builder.addCase(logout.fulfilled, (state, action) => {
      state.auth = {}
      state.user = {}
      localStorage.removeItem(AppConstant.LOCAL_STORAGE_ACCESS_TOKEN_KEY);
    })
  }
});

export const { setAuth, setMeInfo } = userSlice.actions;

export default userSlice.reducer;

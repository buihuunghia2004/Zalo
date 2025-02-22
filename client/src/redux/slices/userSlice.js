import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userAPI from '../../service/userAPI';
import authAPI from '../../service/authAPI';

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

const userSlice = createSlice({
  name: 'user',
  initialState: {
    id:'',
    avatarUrl:'',
    avatarPid:'',
    bio:'',
    email:'',
  },
  reducers: {
    setMeInfo: (state, action) => {
      const {id, avatarUrl, avatarPid, bio, email } = action.payload
      state.id = id
      state.avatarUrl = avatarUrl
      state.avatarPid = avatarPid
      state.bio = bio
      state.email = email
    }
  },
  extraReducers: (builder) => {
    builder.addCase(updateMe.fulfilled, (state, action) => {
      const {id, avatarUrl, avatarPid, bio, email } = action.payload
      state.id = id
      state.avatarUrl = avatarUrl
      state.avatarPid = avatarPid
      state.bio = bio
      state.email = email
    }),
    builder.addCase(getMe.fulfilled, (state, action) => {
      const {id, avatarUrl, avatarPid, bio, email } = action.payload
      state.id = id
      state.avatarUrl = avatarUrl
      state.avatarPid = avatarPid
      state.bio = bio
      state.email = email
    })
  }
});

export const { setMeInfo } = userSlice.actions;

export default userSlice.reducer;

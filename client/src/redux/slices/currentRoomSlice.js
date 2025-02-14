import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import roomAPI from '../../service/roomAPI';
import messageAPI from '../../service/messageAPI';
import AxiosInstant from '../../config/axiosInstant';

const roomUrl = 'rooms'
const messageUrl = 'messages'

export const loadMoreMessages = createAsyncThunk(
  'rooms/load-more-messages',
  async ( {roomId, affterCursor}, {rejectWithValue}) => {    
    try {
      let q = `${messageUrl}?roomId=${roomId}`
      if (affterCursor) q += `&affterCursor=${affterCursor}`
      return await AxiosInstant.get(q)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)
export const getRoomById = createAsyncThunk(
  'rooms/get-room-by-id',
  async ( {roomId}, {rejectWithValue}) => {
    try {
      return await AxiosInstant.get(`${roomUrl}/${roomId}`)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)
export const sendTextMsg = createAsyncThunk(
  'rooms/get-room-by-id',
  async ( {roomId}, {rejectWithValue}) => {
    try {
      return await AxiosInstant.get(`${roomUrl}/${roomId}`)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)


const currentRoomSlice = createSlice({
  name: 'currentRoom',
  initialState: {
    roomId:'',
    partnerId:'',
    memberId: '',
    roomAvatarUrl: '',
    roomAvatarUrls: '',
    roomName: '',
    isGroup: false,
    members:[],
    messages:[],
    pagination:{},
    isWritingMsg:[],
    memberWritingMsg:null,

    isLoading: false
  },
  reducers: {
    setCurrentRoom: (state, action) => {      
      const {id,roomAvatarUrl,roomAvatarUrls,roomName,type,memberCount} = action.payload
      state.roomId = id
      state.roomAvatarUrl = roomAvatarUrl
      state.roomAvatarUrls = roomAvatarUrls
      state.roomName = roomName
      state.type = type
      state.memberCount = memberCount
    },
    setPartnerId: (state, action) => {
      const {partnerId, partnerAvatarUrl} = action.payload
      state.partnerId = partnerId
      state.roomAvatarUrl = partnerAvatarUrl
      state.roomName = roomName
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadMoreMessages.pending, (state, action) => {
      state.isLoading = true
    }),
    builder.addCase(loadMoreMessages.fulfilled, (state, action) => {
      const {data, pagination} = action.payload
      state.messages = data
      state.pagination = pagination
      state.isLoading = false
    }),
    builder.addCase(getRoomById.pending, (state, action) => {
      state.isLoading = true
    }),
    builder.addCase(getRoomById.fulfilled, (state, action) => {
      const {memberId, members} = action.payload
      state.memberId = memberId
      state.members = members
      state.isLoading = false
    })
  }
});

export const { 
  setCurrentRoom
} = currentRoomSlice.actions;

export default currentRoomSlice.reducer;

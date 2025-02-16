import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AxiosInstant from '../../config/axiosInstant';
const roomUrl = 'rooms'
const messageUrl = 'messages'

export const loadMoreMessages = createAsyncThunk(
  'rooms/load-more-messages',
  async ( {roomId, afterCursor}, {rejectWithValue}) => {    
    try {
      let q = `${messageUrl}?roomId=${roomId}`
      if (afterCursor) q += `&afterCursor=${afterCursor}`
      console.log('q',q);
      
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
  'rooms/send-text-msg',
  async ( {roomId, data}, {rejectWithValue}) => {
    try {
      const q = `${messageUrl}/${roomId}/text`
      return await AxiosInstant.post(q,data)
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
    membersObj: {},
    // receivedMemberIds: [],
    // viewedMemberIds: [],
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
    loadMoreMessage: () => {
      
    },
    setReceiver: (state, action) => {
      const { memerId, receivedAt } = action.payload
      state.members = state.members.map(m => {
        if (m.id == memerId) {          
          return {
            ...m,
            msgRTime: receivedAt
          }
        } else {
          return m
        }
      })
    },
    addNewMgs: (state, action) => {
      state.messages = [action.payload,...state.messages]
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadMoreMessages.pending, (state, action) => {
      state.isLoading = true
    }),
    builder.addCase(loadMoreMessages.fulfilled, (state, action) => {
      const {data, pagination} = action.payload
      state.messages = [...state.messages,...data]
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
      state.members.forEach(mem => {
        state.membersObj[mem.id] = mem
      });
      state.isLoading = false
    }),
    builder.addCase(sendTextMsg.fulfilled, (state, action) => {      
      state.messages = [action.payload,...state.messages]
      const receivedMemberIds = action.payload.receivedMemberIds      
      receivedMemberIds.forEach(id => {
        state.membersObj[id] = {
          ...state.membersObj[id],
          msgRTime: action.payload.createdAt
        }
      });
      state.members = state.members.map(m => {
        return {
          ...m,
          ...(receivedMemberIds.includes(m.id) && {msgRTime: action.payload.createdAt})
        }
      })      
    })
  }
});

export const { 
  setCurrentRoom,
  setReceiver,
  addNewMgs
} = currentRoomSlice.actions;

export default currentRoomSlice.reducer;

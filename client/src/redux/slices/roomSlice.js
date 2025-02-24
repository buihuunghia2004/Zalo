import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import roomAPI from '../../service/roomAPI';
import messageAPI from '../../service/messageAPI';
import AxiosInstant from '../../config/axiosInstant';

const roomUrl = 'rooms'

export const getAllRooms = createAsyncThunk(
  'rooms/get-all',
  async ( _, {rejectWithValue}) => {
    try {      
      return await AxiosInstant.get(`${roomUrl}`)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)
export const sendMessage = createAsyncThunk(
  'rooms/send-message',
  async ( data, {rejectWithValue}) => {
    try {
      return await messageAPI.sentMessage(data)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)
// export const sendMessage = createAsyncThunk(
//   'rooms/send-message',
//   async ( data, {rejectWithValue}) => {
//     try {
//       return await messageAPI.sentMessage(data)
//     } catch (error) {
//       return rejectWithValue(error.message)
//     }
//   }
// )


const roomSlice = createSlice({
  name: 'rooms',
  initialState: {
    data:[
      /**
       * id
       * roomAvatarUrl
       * roomAvatarUrls
       * roomName
       * type
       * memberCount
       * lastMsg:{
       *  content: 8,
          type,
          senderId,
          isSelfSent,
          createdAt
       * }
       * unReadMsgCount
       * 
      /  */
    ],
    pending: false
  },
  reducers: {
    addNewMsgToRoom: (state, action) => {
      state.rooms = state.rooms.map((room) => {
        if (room.id === action.payload.roomId) {
          return {
            ...room,
            receivedMsgs: [...(room.receivedMsgs || []), action.payload],
          };
        }
        return room;
      });
    },
    deleteAllReceivedMsg: (state, action) => {
      state.rooms = state.rooms.map((room) => {
        if (room.id === action.payload.roomId) {
          return {
            ...room,
            receivedMsgs: [],
          };
        }
        return room;
      });
    },
    updateLastMsgForRoom: (state, action) => {
      const {roomId, lastMsg} = action.payload
      state.data = state.data.map((room) => {
        return room.id == roomId 
          ? {
            ...room,
            lastMsg: lastMsg,
            unReadMsgCount: room.unReadMsgCount ? (room.unReadMsgCount + 1) : 1
          } 
          : room
      })
    },
    updateLastMsgForRoomWhenSentMsg: (state, action) => {
      const {roomId, lastMsg} = action.payload
      console.log('dô');
      
      state.data = state.data.map((room) => {
        return room.id == roomId 
          ? {
            ...room,
            lastMsg: lastMsg,
          } 
          : room
      })
    },
    loadMoreMsgWhenConnect: (state, action) => {
      const data = action.payload
      const roomIds = Object.keys(data)
      state.data = state.data.map(m => {
        if (roomIds.includes(m.id)) {
          return {
            ...m,
            lastMsg: data[m.id].lastMsg,
            unReadMsgCount: data[m.id].count
          }
        }else{
          return m
        }
      })
    },
    setViewAllMsg: (state, action) => {
      const {roomId} = action.payload
      state.data = state.data.map(r => 
        r.id === roomId ? { ...r, unReadMsgCount: 0 } : r
      );
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getAllRooms.pending, (state, action) => {      
      state.pending = true
    }),
    builder.addCase(getAllRooms.fulfilled, (state, action) => {            
      state.data = action.payload.data
      state.pending = false
    }),
    builder.addCase(sendMessage.pending, (state, action) => {      
      // state.rooms = action.payload.data
    }),
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.rooms = action.payload.data
    })
  }
});

export const { 
  addNewMsgToRoom,
  deleteAllReceivedMsg,
  updateLastMsgForRoom,
  loadMoreMsgWhenConnect,
  setViewAllMsg,
  updateLastMsgForRoomWhenSentMsg
} = roomSlice.actions;

export default roomSlice.reducer;

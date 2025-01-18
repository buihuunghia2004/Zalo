import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import roomAPI from '../../service/roomAPI';
import messageAPI from '../../service/messageAPI';

export const getAllRooms = createAsyncThunk(
  'rooms/get-all',
  async ( _, {rejectWithValue}) => {
    try {
      return await roomAPI.getAllRoomAPI()
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
    rooms:[]
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
      state.rooms = state.rooms.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            lastMsg: lastMsg,
          };
        }
        return room;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllRooms.fulfilled, (state, action) => {
      console.log('rốm',action.payload);
      
      state.rooms = action.payload.data
    }),
    builder.addCase(sendMessage.pending, (state, action) => {      
      state.rooms = action.payload.data
    }),
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.rooms = action.payload.data
    })
  }
});

export const { 
  addNewMsgToRoom,
  deleteAllReceivedMsg,
  updateLastMsgForRoom
} = roomSlice.actions;

export default roomSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import roomAPI from '../../service/roomAPI';
import messageAPI from '../../service/messageAPI';
import AxiosInstant from '../../config/axiosInstant';

const roomUrl = 'rooms'

// export const getAllRooms = createAsyncThunk(
//   'rooms/get-all',
//   async ( _, {rejectWithValue}) => {
//     try {
//       return await roomAPI.getAllRoomAPI()
//     } catch (error) {
//       return rejectWithValue(error.message)
//     }
//   }
// )
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
export const getRoomById = createAsyncThunk(
  'rooms/send-message',
  async ( id, {rejectWithValue}) => {
    try {
      return await AxiosInstant.get(`${roomUrl}/${id}`)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)


const currentRoomSlice = createSlice({
  name: 'currentRoom',
  initialState: {
    id:'',
    roomAvatarUrl: '',
    avatarUrl:'',
    isGroup: false,
    members:[],
    messages:[],
    isWritingMsg:[],
    memberWritingMsg:null,

    isLoading: false
  },
  reducers: {
    addNewMsgToRoom: (state, action) => {
      console.log('aaa',action.payload);
      
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
    builder.addCase(getRoomById.pending, (state, action) => {      
      state.isLoading = true
    }),
    builder.addCase(getRoomById.fulfilled, (state, action) => {
      const {id, roomAvatarUrl, roomName, type, members  } = action.payload
      const newState = {
        id,
        roomName,
        roomAvatarUrl,
        isGroup: type == 'group',
        members,
        messages:[],
        isWritingMsg:[],
        memberWritingMsg:null,
        isLoading: false
      }
      state = newState
    })
  }
});

export const { 
  // addNewMsgToRoom,
  // deleteAllReceivedMsg,
  // updateLastMsgForRoom,
} = currentRoomSlice.actions;

export default currentRoomSlice.reducer;

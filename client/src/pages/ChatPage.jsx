import { useEffect, useState } from 'react'
import ConversationList from './chatPage/ConversationList'
import ConversationContent from './chatPage/ConversationContent'
import { useDispatch, useSelector } from 'react-redux'
import { getAllRooms, updateLastMsgForRoom } from '../redux/slices/roomSlice'
import useSocketEvent from '../hooks/useSocket'
import { addNewMgs } from '../redux/slices/currentRoomSlice'

const ChatPage = () => {
  const meId = useSelector(state => state.me.user.id)
  const rooms = useSelector((state) => state.rooms.data)
  const currentRoomId = useSelector(state => state.currentRoom.roomId)
  const distpatch = useDispatch()
  const [sortedRooms, setSortedRooms] = useState(rooms)
  const [newMessage, setNewMessage] = useState(null);
  console.log('re-render-ChatPage');
  
  
  useSocketEvent(
    `new_message`,(data) => {           
      console.log('có tin nhắn mới: ', data);
      console.log(currentRoomId == data.roomId);
      console.log(currentRoomId);
      console.log(data.roomId);
      if (data.sender.userId != meId) {
        if (currentRoomId == data.roomId) {
          distpatch(addNewMgs(data))
        }else{
          distpatch(updateLastMsgForRoom({
            roomId: data.roomId,
            lastMsg: data
          }))
        }
      }
      
      
      
      
      // if (!currentRoom || (data.roomId != currentRoom.id)) {
      //   distpatch(addNewMsgToRoom(data))
      // }else{
      //   setNewMessage(data)
      // }

      // distpatch(updateLastMsgForRoom({
      //   roomId: data.roomId,
      //   lastMsg:{
      //     content: data.content,
      //     type: data.type,
      //     createdAt: data.createdAt,
      //     isSelfSent: false
      //   }
      // }))
    }
  )

  useEffect(() => {    
    distpatch(getAllRooms())
  }, [])

  useEffect(() => {    
    const s = [...rooms].sort((a, b) => new Date(b.lastMsg?.createdAt) - new Date(a.lastMsg?.createdAt));
    setSortedRooms(s)

    console.log('rrr',rooms);
    
  }, [rooms])

  return (
    <div className="flex size-full flex-row">
      {/* danh sách hội thoại */}
      <ConversationList
        rooms={rooms}
      />
      <div className='w-0.5 h-full bg-slate-400'/>
      {/* nội dung */}
      { currentRoomId &&
        <ConversationContent
          newMsg={newMessage}
        />
      }
    </div>
  )
}

export default ChatPage
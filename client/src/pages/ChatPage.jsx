import { useEffect, useState } from 'react'
import ConversationList from './chatPage/ConversationList'
import ConversationContent from './chatPage/ConversationContent'
import { useSocket } from '../socket/SocketProvider'
import { useDispatch, useSelector } from 'react-redux'
import { addNewMsgToRoom, getAllRooms, updateLastMsgForRoom } from '../redux/slices/roomSlice'
import useSocketEvent from '../hooks/useSocket'

const ChatPage = () => {
  const rooms = useSelector((state) => state.rooms.data)  
  const distpatch = useDispatch()
  const [currentRoom, setCurrentRoom] = useState()
  const [sortedRooms, setSortedRooms] = useState(rooms)
  const [newMessage, setNewMessage] = useState(null);
  const { emit } = useSocket();

  const meId = useSelector((state) => state.me.user?.id)
  console.log('re-render');
  
  
  useSocketEvent(
    `new_message`,(data) => {           
      
      if (!currentRoom || (data.roomId != currentRoom.id)) {
        distpatch(addNewMsgToRoom(data))
      }else{
        setNewMessage(data)
      }

      distpatch(updateLastMsgForRoom({
        roomId: data.roomId,
        lastMsg:{
          content: data.content,
          type: data.type,
          createdAt: data.createdAt,
          isSelfSent: false
        }
      }))
    }
  )

  useEffect(() => {    
    distpatch(getAllRooms())
  }, [])

  useEffect(() => {    
    const s = [...rooms].sort((a, b) => new Date(b.lastMsg?.createdAt) - new Date(a.lastMsg?.createdAt));
    setSortedRooms(s)
  }, [rooms])

  return (
    <div className="flex size-full flex-row">
      {/* danh sách hội thoại */}
      <ConversationList
        rooms={sortedRooms}
      />
      <div className='w-0.5 h-full bg-slate-400'/>
      {/* nội dung */}
      <ConversationContent
        newMsg={newMessage}
      />
    </div>
  )
}

export default ChatPage
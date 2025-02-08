import { useEffect, useState } from 'react'
import ConversationList from './chatPage/ConversationList'
import ConversationContent from './chatPage/ConversationContent'
import { useSocket } from '../socket/SocketProvider'
import { useDispatch, useSelector } from 'react-redux'
import { addNewMsgToRoom, getAllRooms, updateLastMsgForRoom } from '../redux/slices/roomSlice'
import useSocketEvent from '../hooks/useSocket'

const ChatPage = () => {
  const rooms = useSelector((state) => state.rooms.rooms)
  const distpatch = useDispatch()
  const [currentRoom, setCurrentRoom] = useState()
  const [sortedRooms, setSortedRooms] = useState(rooms)
  const [newMessage, setNewMessage] = useState(null);
  const { emit } = useSocket();

  const meId = useSelector((state) => state.me.user?.id)
  
  useSocketEvent(
    `event:notify:${meId}:new_message`,(data) => {           
      
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

      //đã nhận tin nhắn
      emit('received-message',{
        msgId:data.id,
        senderId:data.sender.user.id,
        memberId: rooms.find(room => room.id == data.roomId).members.find(member => member.user.id == meId).id
      })
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
    <div className="flex size-full flex-row bg-dark-2">
      {/* danh sách hội thoại */}
      <ConversationList
        rooms={sortedRooms}
        setCurrentConversation={(it)=>setCurrentRoom(it)}
      />
      {/* nội dung */}
      {
        currentRoom &&
        <ConversationContent
          roomId={currentRoom.id}
          newMsg={newMessage}
        />
      }
    </div>
  )
}

export default ChatPage
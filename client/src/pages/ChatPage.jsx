import { useEffect, useState } from 'react'
import ConversationInfo from './chatPage/ConversationInfo'
import ConversationList from './chatPage/ConversationList'
import ConversationContent from './chatPage/ConversationContent'
import { SocketProvider, useSocket } from '../socket/SocketProvider'
import { useDispatch, useSelector } from 'react-redux'
import { addNewMsgToRoom, getAllRooms } from '../redux/slices/roomSlice'
import useSocketEvent from '../hooks/useSocket'

const ChatPage = () => {
  const rooms = useSelector((state) => state.rooms.rooms)
  const distpatch = useDispatch()
  const [currentRoom, setCurrentRoom] = useState()
  const [newMessage, setNewMessage] = useState(null);
  const { emit } = useSocket();

  const meId = useSelector((state) => state.me.user?.id)
  
  
  useSocketEvent(
    `event:notify:${meId}:new_message`,(data) => {     
      console.log('new_emssage',data);
      
      if (!currentRoom || (data.roomId != currentRoom.id)) {
        distpatch(addNewMsgToRoom(data))
      }else{
        setNewMessage(data)
      }

      //đã nhận tin nhắn
      emit('received-message',{
        msgId:data.id,
        senderId:data.sender.user.id,
        memberId: currentRoom.members.find(member => member.user.id == meId).id
      })
    }
  )
  useSocketEvent(
    `aaa`,(data) => {     
      console.log('new_emssage',data);
    }
  )

  // useSocketEvent(
  //   `event:notify:${meId}:receivedMsg`,(data) => {            
  //     if (!currentRoom || (data.roomId != currentRoom.id)) {
  //       distpatch(addNewMsgToRoom(data))
  //     }else{
  //       setNewMessage(data)
  //     }

  //     //đã nhận tin nhắn
  //     emit('received-message',{
  //       msgId:data.id,
  //       senderId:'',
  //       memberId: currentRoom.members.find(member => member.user.id == meId).id
  //     })
  //   }
  // )

  useEffect(() => {
    distpatch(getAllRooms())
    emit('load-when-online',{userId: meId})
  }, [])
  
  
  return (
    // <SocketProvider namespace={"notifications"}>
      <div className="flex size-full flex-row bg-dark-2">
        {/* danh sách hội thoại */}
        <ConversationList
          rooms={rooms}
          setCurrentConversation={(it)=>setCurrentRoom(it)}
        />
        {/* nội dung */}
        <div className="flex w-full flex-row">
          {/* hội thoại */}
          {
            currentRoom &&
              <ConversationContent
                avatarUrl={currentRoom?.roomAvatarUrl}
                name={currentRoom?.roomName}
                type={currentRoom?.type}
                roomId={currentRoom?.id}
                newMsg={newMessage}
                currentMember={currentRoom.members.find(member => member.user.id == meId)}
              />
          }
          {/* thông tin hội thoại*/}
          <ConversationInfo/>
        </div>
      </div>
    // </SocketProvider>
  )
}

export default ChatPage
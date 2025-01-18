import { useEffect, useRef, useState } from 'react'
import { Assets } from '../../assets'
import messageAPI from '../../service/messageAPI'
import { useDispatch, useSelector } from 'react-redux'
import SquareIcon from '../../components/icon/squareIcon'
import roomAPI from '../../service/roomAPI'
import useSocketEvent from '../../hooks/useSocket'
import { useSocket } from '../../socket/SocketProvider'
import { deleteAllReceivedMsg, updateLastMsgForRoom } from '../../redux/slices/roomSlice'
import Utils from '../../utils/utils'

const ConversationContent = ({
  avatarUrl,
  name,
  type,
  partnerId,
  currentMember,
  roomId,
  newMsg
}) => {
  const dispatch = useDispatch()
  const [isInputFocus, setIsInputFocus] = useState(false)
  const [textContent, setTextContent] = useState('')
  const [messages, setMessages] = useState([])
  const [isPartnerWrite, setIsPartnerWrite] = useState(false)
  const [lastReceiveMsgIds, setLastReceiveMsgIds] = useState([])
  const [room, setRoom] = useState({ id: roomId })
  const [lastRCV, setLastRCV] = useState(null)
  const [msgRep, setMsgRep] = useState(null)
  const [lastViewed, setLastViewed] = useState(null)
  const messagesEndRef = useRef(null)
  const { emit } = useSocket()
  const meId = useSelector((state) => state.me.user?.id)

  useSocketEvent(`event:${roomId}:writing_message`, (data) => {
    setIsPartnerWrite(data.status)
  })
  useSocketEvent(`a:${meId}:b`, (data) => {        
    const [rcv, viewed ] = getLastRCVAndViewd(data,messages)
    setLastRCV(rcv)
    setLastViewed(viewed)
    setLastReceiveMsgIds(data)
  })
  useSocketEvent(`user-joined`, (data) => {
    console.log('đã vào', data.clientId)
  })
  useSocketEvent(`user-outed`, (data) => {
    console.log('đã thoát', data.clientId)
  })  

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }
  const SendMessage = async ({content, parentMessage}) => {
    try {
      const data = {
        receiverId: partnerId,
        roomId: room.id,
        content: content,
        contentType: 'text',
      }
      
      if (msgRep) {
        data.replyMessageId = msgRep.id
      }
      const newMessage = await messageAPI.sentMessage(
        data
      )
      
      newMessage.isSelfSent = true
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...newMessage,
          parentMessage
        }
      ])
      scrollToBottom()
      setTextContent('')
      dispatch(updateLastMsgForRoom({
        roomId: roomId,
        lastMsg:{
          content: newMessage.content,
          type: newMessage.type,
          createdAt: newMessage.createdAt,
          isSelfSent: newMessage.isSelfSent,
        }
      }))
      setMsgRep(null)
    } catch (error) {}
  }
  
  useEffect(() => {
    const fetchRoomId = async () => {
      const room = await roomAPI.getRoomIdByUserIdAPI(partnerId)
      setRoom({ ...room, id: room.roomId })
    }

    if (!roomId && partnerId) {
      fetchRoomId()
    }
    emit('join-room', { roomId: roomId, userId: meId })
    dispatch(deleteAllReceivedMsg({ roomId: roomId }))
    
    return () => {
      emit('out-room', { roomId: roomId })
    }
    
  }, [])

  useEffect(() => {    
    if (newMsg) {
      setMessages((prevMessages) => [...prevMessages,newMsg]);
    }
  }, [newMsg]);

  useEffect(() => {
    const fetchLoadMoreMessages = async () => {
      const data = await messageAPI.loadMoreMessage({
        roomId: roomId || room.id,
      })
      setMessages(data.data.reverse())
    }
    if (room) {
      fetchLoadMoreMessages()
    }
  }, [room, roomId])

  useEffect(() => {
    const i = setTimeout(() => {
      if (textContent) {
        emit('writing-message', {
          roomId: room.id,
          status: true,
        })
      } else {
        emit('writing-message', {
          roomId: room.id,
          status: false,
        })
      }
    }, 500)
    return () => {
      clearTimeout(i)
    }
  }, [textContent])

  return (
    <div className="mx-0.5 flex w-full flex-col">
      {/* header */}
      <div className="flex h-20 flex-row items-center bg-dark-3 p-4">
        <div className="flex w-full flex-row items-center">
          <img
            className="size-12 rounded-full"
            src={avatarUrl}
            alt="Placeholder"
          />
          <div className="mx-3 flex w-full flex-col justify-between py-1">
            <p className="text-lg font-bold text-cyan-50">{name}</p>
            <p className="text-sm text-slate-400">Truy cập 1 giờ trước</p>
          </div>
        </div>
        <SquareIcon src={Assets.icons.call} />
        <SquareIcon src={Assets.icons.videoCall} />
        <SquareIcon src={Assets.icons.addGroup} />
      </div>
      {/* nội dung hội thoại */}
      <div className="h-full overflow-auto p-8 scrollbar-hide">
        {messages.map((item, index) => (
          <MessageItem
            key={index.toString()}
            data={{ ...item, isLastest: index == messages.length - 1 }}
            isShowTime={!messages[index+1] || messages[index].isSelfSent != messages[index+1]?.isSelfSent}
            lastReceiveMsgIds={lastReceiveMsgIds}
            setMsgRep={setMsgRep}
            msgRep={item.parentMessage}
            lastRCV={lastRCV}
          />
        ))}
        <div ref={messagesEndRef} className="h-5 w-full" />{' '}
        {/* Placeholder để cuộn tới */}
      </div>
      {isPartnerWrite && (
        <div className="flex">
          <p className="bg-dark-5 px-2 text-white">Đang soạn tin nhắn</p>
        </div>
      )}
      {/* nhập tin nhắn */}
      <div
        className={`${isInputFocus ? 'bg-blue-600' : 'bg-dark-2'} mt-0.5 flex flex-col gap-0.5`}
      >
        <div className="h-8 w-full bg-dark-3 px-2"></div>
        {
          msgRep &&
          <div className='flex flex-row justify-between px-2'>
            <p className='text-white'>{msgRep.content}</p>
            <p onClick={()=>setMsgRep(null)} className='text-red-600 font-medium'>Hủy</p>
          </div>
        }
        <div className="flex h-12 flex-row items-center justify-center bg-dark-3 px-4">
          <input
            className="w-full bg-dark-3 text-base text-cyan-50 focus:outline-none"
            placeholder="Nhập @, tin nhắn..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            onFocus={() => setIsInputFocus(true)}
            onBlur={() => setIsInputFocus(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const data = {
                  content: textContent
                }
                if (msgRep) {
                  data.parentMessage = {
                    id: msgRep.id,
                    content: msgRep.content
                  }
                }
                SendMessage(data)
              }
            }}
          />
          <img
            className="size-6"
            src={textContent.length > 0 ? Assets.icons.send : Assets.icons.like}
            onClick={() => {
              if (textContent.length > 0) {
                const data = {
                  content: textContent
                }
                if (msgRep) {
                  data.parentMessage = {
                    id: msgRep.id,
                    content: msgRep.content
                  }
                }
                SendMessage(data)
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

const MessageItem = ({
  data,
  msgRep,
  isShowTime,
  setMsgRep,
  lastRCV
 }) => {
  const {
    content,
    id,
    type,
    status,
    sender, 
    isSelfSent,
    createdAt,
    isLastest
  } = data

  const [isHovered, setIsHovered] = useState(false); // Trạng thái hover
  const ref = useRef(null);
  
  useEffect(() => {
    const element = ref.current;

    const handleMouseEnter = () => setIsHovered(true); // Đang hover
    const handleMouseLeave = () => setIsHovered(false); // Không hover

    // Gắn sự kiện
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    // Dọn dẹp sự kiện khi component bị unmount
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={ref}
      className={`flex flex-col`}
    >
      <div className={`my-2 flex ${isSelfSent && 'flex-row-reverse'}`}>
        {!isSelfSent && (
          <img
            className="size-8 rounded-full"
            src={sender.user.avatarUrl}
            alt="Placeholder"
          />
        )}
        <p className="max-w-80 break-words text-white">{isSelfSent}</p>
        <div
          className={`rounded bg-slate-500 p-2 ${!isSelfSent ? 'ml-2' : 'mr-2'}`}
        >
          { msgRep &&
            <div className='bg-dark-5 rounded-md p-2'>
              <p className='text-white font-bold'>Nghĩa</p>
              <p className='text-white'>{msgRep?.content || ''}</p>
            </div>
          }
          <p className="min-w-12 max-w-80 break-words text-white ">{content}</p>
          {
            isShowTime &&
            <p className="text-xs text-white font-mono">{Utils.timeToMmSs(createdAt)}</p>
          }
        </div>
        {
          isHovered &&
          <div onClick={()=>setMsgRep(data)}>
            <img
              className="size-4 rounded-full"
              src={sender.user.avatarUrl}
              alt="Placeholder"
            />
          </div>
        }
      </div>
      <div className={`flex ${isSelfSent && 'flex-row-reverse'}`}>
        {isSelfSent && isLastest &&  (
          <p className={`rounded-md bg-dark-5 p-1 text-xs text-white`}>
            {lastRCV >= createdAt ? 'Đã nhận' :'Đã gửi'}
          </p>
        )}
      </div>
    </div>
  )
}
const getLastRCVAndViewd = (data, messages) => {
  let rcv
  let viewed

  if (data && Array.isArray(data)) {
    data.forEach(element => {
      const rcvCreatedAt = messages.find(message => message.id == element.receivedMsgId).createdAt
      const viewedCreatedAt = messages.find(message => message.id == element.receivedMsgId).createdAt      
      if (!rcv || rcv < rcvCreatedAt) {
        rcv = rcvCreatedAt
      }
      if (!viewed || viewed < viewedCreatedAt) {
        viewed = viewedCreatedAt
      }
    });
  }

  return [rcv, viewed]
}

export default ConversationContent

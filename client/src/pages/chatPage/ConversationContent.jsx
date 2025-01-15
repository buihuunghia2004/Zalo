import { useEffect, useRef, useState } from 'react'
import { Assets } from '../../assets'
import messageAPI from '../../service/messageAPI'
import { useDispatch, useSelector } from 'react-redux'
import SquareIcon from '../../components/icon/squareIcon'
import roomAPI from '../../service/roomAPI'
import useSocketEvent from '../../hooks/useSocket'
import { useSocket } from '../../socket/SocketProvider'
import { deleteAllReceivedMsg } from '../../redux/slices/roomSlice'

const ConversationContent = ({
  avatarUrl,
  name,
  type,
  partnerId,
  roomId,
  newMsg
}) => {
  const dispatch = useDispatch()
  const [isInputFocus, setIsInputFocus] = useState(false)
  const [textContent, setTextContent] = useState('')
  const [messages, setMessages] = useState([])
  const [isPartnerWrite, setIsPartnerWrite] = useState(false)
  const [room, setRoom] = useState({ id: roomId })
  const messagesEndRef = useRef(null)
  const { emit } = useSocket()
  const meId = useSelector((state) => state.me.user?.id)


  // useSocketEvent(
  //   `event:notify:${meId}:new_message`,(data) => {
  //     setMessages((prevMessages) => [data, ...prevMessages])
  //   }
  // )
  useEffect(() => {
    if (newMsg) {
      setMessages((prevMessages) => [newMsg,...prevMessages]); // Thêm tin nhắn mới vào danh sách
    }
  }, [newMsg]);

  useSocketEvent(`event:${roomId}:writing_message`, (data) => {
    setIsPartnerWrite(data.status)
  })
  useSocketEvent(`user-joined`, (data) => {
    console.log('đã vào', data.clientId)
  })
  useSocketEvent(`user-outed`, (data) => {
    console.log('đã thoát', data.clientId)
  })

  //component
  const MessageItem = ({ data }) => {
    const { content, type, status, sender, isSelfSent, createdAt, isLastest } =
      data
    return (
      <div className={`flex flex-col`}>
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
            <p className="max-w-80 break-words">{content}</p>
          </div>
        </div>
        <div className={`flex ${isSelfSent && 'flex-row-reverse'}`}>
          {isSelfSent && isLastest && (
            <p className={`rounded-md bg-dark-5 p-1 text-xs text-white`}>
              Đã gửi
            </p>
          )}
        </div>
      </div>
    )
  }

  //funtions
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }
  const SendMessage = async (userId, message) => {
    try {
      const newMessage = await messageAPI.sentMessage({
        receiverId: partnerId,
        roomId: room.id,
        content: message,
        contentType: 'text',
      })
      newMessage.isSelfSent = true
      setMessages((prevMessages) => [newMessage, ...prevMessages])
      scrollToBottom()
      setTextContent('')
    } catch (error) {}
  }
  const fetchLoadMoreMessages = async () => {
    const data = await messageAPI.loadMoreMessage({
      roomId: roomId || room.id,
    })
    setMessages(data.data)
  }
  const fetchRoomId = async () => {
    const room = await roomAPI.getRoomIdByUserIdAPI(partnerId)
    setRoom({ ...room, id: room.roomId })
  }

  useEffect(() => {
    if (!roomId && partnerId) {
      fetchRoomId()
    }
    emit('join-room', { roomId: roomId })
    dispatch(deleteAllReceivedMsg({ roomId: roomId }))
    
    return () => {
      emit('out-room', { roomId: roomId })
    }
    
  }, [])

  useEffect(() => {
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
        {[...messages].reverse().map((item, index) => (
          <MessageItem
            key={index.toString()}
            data={{ ...item, isLastest: index == messages.length - 1 }}
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
        <div className="flex h-12 flex-row items-center justify-center bg-dark-3 px-4">
          <input
            className="w-full bg-dark-3 text-base text-cyan-50 focus:outline-none"
            placeholder="Nhập @, tin nhắn..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            onFocus={() => setIsInputFocus(true)}
            onBlur={() => setIsInputFocus(false)}
          />
          <img
            className="size-6"
            src={textContent.length > 0 ? Assets.icons.send : Assets.icons.like}
            onClick={() => {
              if (textContent.length > 0) {
                SendMessage(2, textContent)
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ConversationContent

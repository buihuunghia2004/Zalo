import { useEffect, useRef, useState } from 'react'
import { Assets } from '../../assets'
import messageAPI from '../../service/messageAPI'
import { useDispatch, useSelector } from 'react-redux'
import SquareIcon from '../../components/icon/squareIcon'
import roomAPI from '../../service/roomAPI'
import useSocketEvent from '../../hooks/useSocket'
import { useSocket } from '../../socket/SocketProvider'
import {
  deleteAllReceivedMsg,
  updateLastMsgForRoom,
} from '../../redux/slices/roomSlice'
import Utils from '../../utils/utils'
import { RoomRoleEnum, RoomTypeEnum } from '../../utils/enum'

const ConversationContent = ({
  avatarUrl,
  name,
  type,
  partnerId,
  currentMember,
  members,
  roomId,
  newMsg,
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
  const [files, setFiles] = useState([])
  const [leader, setLeader] = useState()
  const [pagination, setPagination] = useState([])
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const { emit } = useSocket()
  const meId = useSelector((state) => state.me.user?.id)

  useSocketEvent(`event:${roomId}:writing_message`, (data) => {
    setIsPartnerWrite(data.status)
  })
  useSocketEvent(`a:${meId}:b`, (data) => {
    const [rcv, viewed] = getLastRCVAndViewd(data, messages)
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
  const SendMessage = async ({ content, parentMessage, files, type }) => {
    try {
      let newMessage
      const send = async (formData) => {
        newMessage = await messageAPI.sentMessage(formData)
        newMessage.isSelfSent = true
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...newMessage,
            parentMessage,
          },
        ])
      }

      switch (type) {
        case 'text':
          break
        case 'file':
          break
        case 'image':
          break
        case 'video':
          break
        default:
          break
      }

      if (files && files.length > 0) {
        for (const file of files) {
          const form = new FormData()
          if (partnerId) {
            form.append('receiverId', partnerId)
          }
          form.append('roomId', room.id)
          form.append('contentType', 'image')
          form.append('file', file)
          await send(form)
        }
      } else {
        const formData = new FormData()
        if (partnerId) {
          formData.append('receiverId', partnerId)
        } else {
          formData.append('roomId', room.id)
        }
        formData.append('contentType', 'text')
        formData.append('content', content)
        if (msgRep) {
          formData.append('replyMessageId', msgRep.id)
        }
        await send(formData)
      }

      scrollToBottom()
      setTextContent('')
      dispatch(
        updateLastMsgForRoom({
          roomId: roomId,
          lastMsg: {
            content: newMessage.content,
            type: newMessage.type,
            createdAt: newMessage.createdAt,
            isSelfSent: newMessage.isSelfSent,
          },
        })
      )
      setMsgRep(null)
    } catch (error) {}
  }
  const handleFileChange = async (event) => {
    setFiles(event.target.files)
    SendMessage({ files: event.target.files })
    // const files = Array.from(event.target.files)
    // const imageUrls = files.map((file) => URL.createObjectURL(file))
  }
  const handleScroll = async () => {
    const container = messagesContainerRef.current
    if (container.scrollTop === 0) {
      const data = await messageAPI.loadMoreMessage({
        roomId: roomId || room.id,
        afterCursor: pagination.afterCursor,
      })
      setMessages((prev) => [...data?.data.reverse(), ...prev])
      setPagination(data.pagination)
    }
  }

  useEffect(() => {
    const container = messagesContainerRef.current
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [pagination])

  useEffect(() => {
    if (newMsg) {
      setMessages((prevMessages) => [...prevMessages, newMsg])
    }
  }, [newMsg])

  useEffect(() => {
    setRoom({ id: roomId })

    const fetchRoomId = async () => {
      const room = await roomAPI.getRoomIdByUserIdAPI(partnerId)
      setRoom({ ...room, id: room.roomId })
    }

    if (!roomId && partnerId) {
      fetchRoomId()
    }
    emit('join-room', { roomId: roomId, userId: meId })
    dispatch(deleteAllReceivedMsg({ roomId: roomId }))

   

    const fetchLoadMoreMessages = async () => {
      const data = await messageAPI.loadMoreMessage({
        roomId: roomId || room.id,
      })

      setMessages(data.data.reverse()) //beforeCursor
      setPagination(data.pagination) //beforeCursor
    }
    if (room) {
      fetchLoadMoreMessages()
    }

    return () => {
      emit('out-room', { roomId: roomId })
    }
  }, [roomId])

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
  useEffect(() => {
    if (type == RoomTypeEnum.GROUP) {
      const leader = members.filter(m => m.role == RoomRoleEnum.LEADER)[0]
      if (leader) {        
        setLeader(leader)
      }
    }
  }, [])

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
      <div ref={messagesContainerRef} className="h-full overflow-auto p-2">
        {messages.map((item, index) => (
          <MessageItem
            key={index.toString()}
            data={{ ...item, isLastest: index == messages.length - 1 }}
            isShowTime={
              !messages[index + 1] ||
              messages[index].isSelfSent != messages[index + 1]?.isSelfSent
            }
            isLeader={item.sender?.id == leader?.id}
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
        <div
          className="relative w-full bg-dark-3 p-1"
          onClick={() => document.getElementById('fileInput').click()} // Kích hoạt input
        >
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }} // Ẩn input
          />
          <SquareIcon
            src={Assets.icons.image}
            className="size-8 cursor-pointer"
          />
        </div>
        {msgRep && (
          <div className="flex flex-row justify-between px-2">
            <p className="text-white">{msgRep.content}</p>
            <p
              onClick={() => setMsgRep(null)}
              className="font-medium text-red-600"
            >
              Hủy
            </p>
          </div>
        )}
        <div className="flex h-12 flex-row items-center justify-center bg-dark-3 px-4">
          <input
            className="w-full bg-dark-3 text-base text-cyan-50 focus:outline-none"
            placeholder="Nhập @, tin nhắn..."
            value={Utils.convertMsgContent(textContent)}
            onChange={(e) => setTextContent(e.target.value)}
            onFocus={() => setIsInputFocus(true)}
            onBlur={() => setIsInputFocus(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const data = {
                  content: textContent,
                }
                if (msgRep) {
                  data.parentMessage = {
                    id: msgRep.id,
                    content: msgRep.content,
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
                  content: textContent,
                }
                if (msgRep) {
                  data.parentMessage = {
                    id: msgRep.id,
                    content: msgRep.content,
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
  isLeader,
  msgRep,
  isShowTime,
  setMsgRep,
  lastRCV,
  role,
}) => {
  const {
    content,
    id,
    type,
    status,
    sender,
    isSelfSent,
    createdAt,
    isLastest,
  } = data

  const [isHovered, setIsHovered] = useState(false) // Trạng thái hover
  const ref = useRef(null)

  useEffect(() => {    
    const element = ref.current    

    const handleMouseEnter = () => setIsHovered(true) // Đang hover
    const handleMouseLeave = () => setIsHovered(false) // Không hover

    // Gắn sự kiện
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    // Dọn dẹp sự kiện khi component bị unmount
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div ref={ref} className={`flex flex-col`}>
      <div className={`my-2 flex ${isSelfSent && 'flex-row-reverse'}`}>
        <div className="w-10">
          {!isSelfSent && isShowTime && (
            <div class="relative">
              <img
                className="size-10 rounded-full"
                src={sender.user.avatarUrl}
                alt="Placeholder"
              />
              { isLeader &&
                <img
                className="absolute top-7 left-5 size-4"
                src={Assets.icons.roomLeaderKey}
                alt="Placeholder"
              />
              }
            </div>
          )}
        </div>
        <div
          className={`rounded bg-slate-500 p-2 ${!isSelfSent ? 'ml-2' : 'mr-2'}`}
        >
          {msgRep && (
            <div className="rounded-md bg-dark-5 p-2">
              <p className="font-bold text-white">Nghĩa</p>
              {msgRep.type == 'text' ? (
                <p className="text-white">{msgRep?.content || ''}</p>
              ) : (
                <div class="max-w-lg p-4">
                  <div class="relative overflow-hidden">
                    <img
                      src={msgRep.content}
                      alt="Dynamic Image"
                      class="max-h-[300px] max-w-full rounded-md border object-contain shadow-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          {type == 'text' ? (
            <p className="min-w-12 max-w-80 break-words text-white">
              {content}
            </p>
          ) : (
            <div class="max-w-lg p-4">
              <div class="relative overflow-hidden">
                <img
                  src={content}
                  alt="Dynamic Image"
                  class="max-h-[300px] max-w-full rounded-md border object-contain shadow-lg"
                />
              </div>
            </div>
          )}

          {isShowTime && (
            <p className="font-mono text-xs text-white">
              {Utils.timeToMmSs(createdAt)}
            </p>
          )}
        </div>
        {isHovered && (
          <div onClick={() => setMsgRep(data)}>
            <img
              className="size-4 rounded-full"
              src={sender.user.avatarUrl}
              alt="Placeholder"
            />
          </div>
        )}
      </div>
      <div className={`flex ${isSelfSent && 'flex-row-reverse'}`}>
        {isSelfSent && isLastest && (
          <p className={`rounded-md bg-dark-5 p-1 text-xs text-white`}>
            {lastRCV >= createdAt ? 'Đã nhận' : 'Đã gửi'}
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
    data.forEach((element) => {
      const rcvCreatedAt = messages.find(
        (message) => message.id == element.receivedMsgId
      ).createdAt
      const viewedCreatedAt = messages.find(
        (message) => message.id == element.receivedMsgId
      ).createdAt
      if (!rcv || rcv < rcvCreatedAt) {
        rcv = rcvCreatedAt
      }
      if (!viewed || viewed < viewedCreatedAt) {
        viewed = viewedCreatedAt
      }
    })
  }

  return [rcv, viewed]
}

export default ConversationContent

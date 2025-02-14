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
import ConversationInfo from './ConversationInfo'
import { getRoomById, loadMoreMessages } from '../../redux/slices/currentRoomSlice'

const ConversationContent = ({ newMsg, partnerId }) => {
  const dispatch = useDispatch()
  const room = useSelector(state => state.currentRoom)
  const roomId = useSelector(state => state.currentRoom.roomId)
  const memberId = useSelector(state => state.currentRoom.memberId)
  const messages = useSelector(state => state.currentRoom.messages)
  const meId = useSelector((state) => state.me.user?.id)

  const { emit } = useSocket()

  const [isInputFocus, setIsInputFocus] = useState(false)
  const [textContent, setTextContent] = useState('')
  const [isWriting, setIsWriting] = useState(false)
  const [messagess, setMessages] = useState([])
  const [partnerWriting, setpartnerWriting] = useState({})
  const [lastReceiveMsgIds, setLastReceiveMsgIds] = useState([])
  const [lastRCV, setLastRCV] = useState(null)
  const [msgRep, setMsgRep] = useState(null)
  const [leader, setLeader] = useState()
  const [pagination, setPagination] = useState([])
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  // if (roomId) {
  useSocketEvent('writing_message', (data) => {          
    setpartnerWriting(data)
  })
  
  // }
  useSocketEvent(`a:${meId}:b`, (data) => {
    const [rcv, viewed] = getLastRCVAndViewd(data, messages)
    setLastRCV(rcv)
    setLastReceiveMsgIds(data)
  })

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }
  const SendMessage = async ({ content, parentMessage, files, type, roomId }) => {
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
  const sendTextMsg = async ({roomId, content}) => {

  }
  const handleFileChange = async (event) => {
    SendMessage({ files: event.target.files })
  }
  const handleScroll = async () => {
    const container = messagesContainerRef.current
    if (container.scrollTop === 0 && pagination.afterCursor) {
      const data = await messageAPI.loadMoreMessage({
        roomId: roomId || room.id,
        afterCursor: pagination.afterCursor,
      })
      setMessages((prev) => [...data?.data.reverse(), ...prev])
      setPagination(data.pagination)
    }
  }

  //load message
  useEffect(() => {
    if (roomId) {
      dispatch(getRoomById({roomId}))
      dispatch(loadMoreMessages({roomId}))
      emit('join-room', { roomId})
    }     


    // const fetchRoom = async ({roomId, partnerId}) => {
    //   let newRoomId = roomId
      
    //   if (!roomId && partnerId) {
    //     const roomFetch = await roomAPI.getRoomIdByUserIdAPI(partnerId)
    //     newRoomId = roomFetch.roomId
    //   }

    //   //emit join-room
    //   emit('join-room', { roomId: roomId})
      
    //   dispatch(deleteAllReceivedMsg({ roomId: roomId }))
      
    //   //fetch room info after have roomId
    //   const room = await roomAPI.getRoomByIdAPI(newRoomId)
    //   if (room) {
    //     //setRoom(room)
        
    //     //load messages
    //     const data = await messageAPI.loadMoreMessage({
    //       roomId: roomId || room.id,
    //     })
  
    //     setMessages(data.data.reverse()) //beforeCursor
    //     setPagination(data.pagination) //beforeCursor
    //   }
      
    // }

    // fetchRoom({roomId, partnerId})

    return () => {
      emit('leave-room', { roomId: roomId })
    }
  }, [roomId])

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
    // const i = setTimeout(() => {
    //   if (textContent) {
    //     emit('writing-message', {
    //       roomId: room.id,
    //       status: true,
    //     })
    //   } else {
    //     emit('writing-message', {
    //       roomId: room?.id || roomId,
    //       status: false,
    //     })
    //   }
    // }, 500)
    // return () => {
    //   clearTimeout(i)
    // }

    if (textContent && !isWriting) {
      emit('writing-message', {
        roomId: room?.id || roomId,
        status: true,
      })
      setIsWriting(true)
    }else if(!textContent && isWriting){
      emit('writing-message', {
        roomId: room?.id || roomId,
        status: false,
      })
      setIsWriting(false)
    }
  }, [textContent])

  useEffect(() => {
    if (room?.type == RoomTypeEnum.GROUP) {
      const leader = members.filter((m) => m.role == RoomRoleEnum.LEADER)[0]
      if (leader) {
        setLeader(leader)
      }
    }
  }, [])

  return (
    <div className="flex w-full flex-row">
      <div className="flex w-full flex-col">
        {/* header */}
        <div className="flex h-20 flex-row items-center p-4">
          <div className="flex w-full flex-row items-center">
            <img
              className="size-12 rounded-full"
              src={room?.roomAvatarUrl}
              alt="Placeholder"
            />
            <div className="mx-3 flex w-full flex-col justify-between py-1">
              <p className="text-lg font-bold">{room?.roomName}</p>
              <p className="text-sm text-slate-400">Truy cập 1 giờ trước</p>
            </div>
          </div>
          <SquareIcon src={Assets.icons.call} />
          <SquareIcon src={Assets.icons.videoCall} />
          <SquareIcon src={Assets.icons.addGroup} />
        </div>
        <div className='h-0.5 w-full bg-slate-400'/>
        {/* nội dung hội thoại */}
        <div ref={messagesContainerRef} className="h-full overflow-auto p-2 bg-slate-100">
          {messages.map((item, index) => (
            <MessageItem
              key={index.toString()}
              data={{ ...item, isLastest: index == messages.length - 1 }}
              isShowTime={
                !messages[index + 1] ||
                messages[index].isSelfSent != messages[index + 1]?.isSelfSent
              }
              isShowAvatar = {
                messages[index]?.sender.id !== messages[index - 1]?.sender?.id
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
        {partnerWriting?.status && (memberId != partnerWriting?.memberId) && (
          <div className="flex">
            <p className="bg-dark-5 px-2 ">{`Đang soạn tin nhắn`}</p>
          </div>
        )}

        {/* nhập tin nhắn */}
        <div
          className={`flex flex-col gap-0.5`}
        >
          <div className='h-0.5 w-full bg-slate-400'/>
          <div
            className="relative w-full p-1"
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
              <p className="">{msgRep.content}</p>
              <p
                onClick={() => setMsgRep(null)}
                className="font-medium text-red-600"
              >
                Hủy
              </p>
            </div>
          )}
          <div className='h-0.5 w-full bg-slate-400'/>
          <div className="flex h-12 flex-row items-center justify-center px-4">
            <input
              className="w-full text-base focus:outline-none"
              placeholder="Nhập @, tin nhắn..."
              maxLength={100}
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
      <div className='h-full w-0.5 bg-slate-400'/>
      {
        room &&
        <ConversationInfo
          room={room}
        />
      }
    </div>
    
  )
}

const MessageItem = ({
  data,
  isLeader,
  msgRep,
  isShowTime,
  isShowAvatar,
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
          {!isSelfSent && isShowAvatar && (
            <div class="relative">
              <img
                className="size-10 rounded-full"
                src={sender.user.avatarUrl}
                alt="Placeholder"
              />
              {isLeader && (
                <img
                  className="absolute left-5 top-7 size-4"
                  src={Assets.icons.roomLeaderKey}
                  alt="Placeholder"
                />
              )}
            </div>
          )}
        </div>
        <div
          className={`rounded bg-white border-2 border-slate-300  p-2 ${!isSelfSent ? 'ml-2' : 'mr-2'}`}
        >
          {msgRep && (
            <div className="rounded-md p-2">
              <p className="font-bold ">Nghĩa</p>
              {msgRep.type == 'text' ? (
                <p className="">{msgRep?.content || ''}</p>
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
            <p className="min-w-12 max-w-80 break-words">
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
            <p className="font-mono text-xs">
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

import { useEffect, useRef, useState, memo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Assets } from '../../assets'
import { useDispatch, useSelector } from 'react-redux'
import SquareIcon from '../../components/icon/squareIcon'
import useSocketEvent from '../../hooks/useSocket'
import { useSocket } from '../../socket/SocketProvider'
import Utils from '../../utils/utils'
import {
  getRoomById,
  loadMoreMessages,
  sendTextMsg,
  setReceiver,
} from '../../redux/slices/currentRoomSlice'

const ConversationContent = () => {
  const dispatch = useDispatch()
  const { emit } = useSocket()
  const roomName = useSelector((state) => state.currentRoom.roomName)
  const roomAvatarUrl = useSelector((state) => state.currentRoom.roomAvatarUrl)
  const roomId = useSelector((state) => state.currentRoom.roomId)
  // const members = useSelector((state) => state.currentRoom.members)
  // let membersObj = {}
  // members.forEach((mem) => {
  //   membersObj[mem.id] = mem
  // })
  console.log('re-render-ConversationContent')

  // if (roomId) {
  // useSocketEvent('writing_message', (data) => {
  //   setpartnerWriting(data)
  // })
  useSocketEvent('load_more_msgs_when_connect', (data) => {
    console.log('after connect', data)
  })
  useSocketEvent('received_msg', (data) => {
    console.log('received_msg', data)
    dispatch(setReceiver(data))
  })
  // const SendMessage = async ({ content, files, type, roomId }) => {
  //   try {
  //     let newMessage
  //     const send = async (formData) => {
  //       newMessage = await messageAPI.sentMessage(formData)
  //       newMessage.isSelfSent = true
  //     }

  //     switch (type) {
  //       case 'text':
  //         break
  //       case 'file':
  //         break
  //       case 'image':
  //         break
  //       case 'video':
  //         break
  //       default:
  //         break
  //     }

  //     if (files && files.length > 0) {
  //       for (const file of files) {
  //         const form = new FormData()
  //         if (partnerId) {
  //           form.append('receiverId', partnerId)
  //         }
  //         form.append('roomId', roomId)
  //         form.append('contentType', 'image')
  //         form.append('file', file)
  //         await send(form)
  //       }
  //     } else {
  //       const formData = new FormData()
  //       if (partnerId) {
  //         formData.append('receiverId', partnerId)
  //       } else {
  //         formData.append('roomId', roomId)
  //       }
  //       formData.append('contentType', 'text')
  //       formData.append('content', content)
  //       if (msgRep) {
  //         formData.append('replyMessageId', msgRep.id)
  //       }
  //       await send(formData)
  //     }

  //     scrollToBottom()
  //     setTextContent('')
  //     dispatch(
  //       updateLastMsgForRoom({
  //         roomId: roomId,
  //         lastMsg: {
  //           content: newMessage.content,
  //           type: newMessage.type,
  //           createdAt: newMessage.createdAt,
  //           isSelfSent: newMessage.isSelfSent,
  //         },
  //       })
  //     )
  //     setMsgRep(null)
  //   } catch (error) {}
  // }

  

  //load message
  useEffect(() => {
    if (roomId) {
      dispatch(getRoomById({ roomId }))
      dispatch(loadMoreMessages({ roomId }))
      emit('join-roomm', { roomId })
    }

    return () => {
      emit('leave-room', { roomId: roomId })
    }
  }, [roomId])

  

  // useEffect(() => {
  //   if (room?.type == RoomTypeEnum.GROUP) {
  //     const leader = members.filter((m) => m.role == RoomRoleEnum.LEADER)[0]
  //     if (leader) {
  //       setLeader(leader)
  //     }
  //   }
  // }, [])

  useEffect(() => {
    const div = document.getElementById('scrollableDiv')
    if (div)
      console.log(
        'scrollHeight:',
        div.scrollHeight,
        'clientHeight:',
        div.clientHeight
      )
  }, [])

  return (
    <div className="flex w-full flex-row">
      <div className="flex w-full flex-col">
        {/* header */}
        <div className="flex h-20 flex-row items-center p-4">
          <div className="flex w-full flex-row items-center">
            <img
              className="size-12 rounded-full"
              src={roomAvatarUrl}
              alt="Placeholder"
            />
            <div className="mx-3 flex w-full flex-col justify-between py-1">
              <p className="text-lg font-bold">{roomName}</p>
              <p className="text-sm text-slate-400">Truy cập 1 giờ trước</p>
            </div>
          </div>
          <SquareIcon src={Assets.icons.call} />
          <SquareIcon src={Assets.icons.videoCall} />
          <SquareIcon src={Assets.icons.addGroup} />
        </div>
        <div className="h-0.5 w-full bg-slate-400" />
        {/* nội dung hội thoại */}
        <MsgContent roomId={roomId} />
        {/* nhập tin nhắn */}
        <MsgInput roomId={roomId} />
      </div>
      <div className="h-full w-0.5 bg-slate-400" />
      {/* {room && <ConversationInfo room={room} />} */}
    </div>
  )
}

const MsgContent = ({ roomId }) => {
  const dispatch = useDispatch()
  const messages = useSelector((state) => state.currentRoom.messages)
  const pagination = useSelector((state) => state.currentRoom.pagination)
  const members = useSelector((state) => state.currentRoom.members)
  const memberId = useSelector((state) => state.currentRoom.memberId)

  let membersObj = {}
  members.forEach((mem) => {
    membersObj[mem.id] = mem
  })

  const fetchMoreMessages = ({ roomId, afterCursor }) => {
    console.log('fetch');
    
    dispatch(loadMoreMessages({ roomId, afterCursor }))
  }

  useSocketEvent('writing_message', (data) => {
    setpartnerWriting(data)
  })
  return (
    <>
      <div
        id="scrollableDiv"
        className="flex h-full flex-col-reverse overflow-auto bg-slate-100"
      >
        {/*Put the scroll bar always on the bottom*/}
        <InfiniteScroll
          dataLength={messages.length}
          next={() =>
            fetchMoreMessages({
              roomId,
              afterCursor: pagination.afterCursor,
            })
          }
          style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
          inverse={true} //
          hasMore={pagination.afterCursor}
          loader={<h4>Loading...</h4>}
          scrollableTarget="scrollableDiv"
        >
          {messages.map((item, index) => {
            const senderId = item.sender.id
            const isLastMsgEachMember =
              senderId != messages[index - 1]?.sender.id
            const isSelfSent = senderId == memberId

            return (
              <>
                <MessageItem
                  key={item.id}
                  data={item}
                  isShowTime={index == 0 || isLastMsgEachMember}
                  isShowAvatar={isLastMsgEachMember && !isSelfSent}
                  isShowStatus={senderId == memberId && index == 0}
                  isSelfSent={isSelfSent}
                  status={members.some(
                    (m) =>
                      new Date(m?.msgRTime).getTime() >=
                        new Date(item.createdAt).getTime() && m.id != memberId
                  )}
                  avatarUrl={membersObj[senderId].user.avatarUrl}
                  // isLeader={senderId == leader?.id}
                  // setMsgRep={setMsgRep}
                  msgRep={item.parentMessage}
                />
              </>
            )
          })}
        </InfiniteScroll>
      </div>
      <WritingCompoent memberId={memberId}/>
    </>
  )
}

const WritingCompoent = ({memberId}) => {
  const [partnerWriting, setPartnerWriting] = useState({})
  useSocketEvent('writing_message', (data) => {
    setPartnerWriting(data)
  })
  
  return (
    <>
      {partnerWriting?.status && memberId != partnerWriting?.memberId && (
        <div className="flex">
          <p className="bg-dark-5 px-2">{`Đang soạn tin nhắn`}</p>
        </div>
      )}
    </>
  )
}

const MsgInput = ({ roomId }) => {
  const dispatch = useDispatch()
  const { emit } = useSocket()

  const [textContent, setTextContent] = useState('')
  const [msgRep, setMsgRep] = useState(null)
  const [isWriting, setIsWriting] = useState(false)


  const handleFileChange = async (event) => {
    // SendMessage({ files: event.target.files })
  }

  const sendTextMessage = async ({ roomId, content }) => {
    dispatch(sendTextMsg({ roomId, data: { content } }))
    // scrollToBottom()
    setTextContent('')
    // setMsgRep(null)
  }

  // useEffect(() => {
  //   if (textContent && !isWriting) {
  //     emit('writing-message', {
  //       roomId: roomId,
  //       status: true,
  //     })
  //     setIsWriting(true)
  //   } else if (!textContent && isWriting) {
  //     emit('writing-message', {
  //       roomId: roomId,
  //       status: false,
  //     })
  //     setIsWriting(false)
  //   }
  // }, [textContent])

  return (
    <div className={`flex flex-col gap-0.5`}>
      <div className="h-0.5 w-full bg-slate-400" />
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
      <div className="h-0.5 w-full bg-slate-400" />
      <div className="flex h-12 flex-row items-center justify-center px-4">
        <input
          className="w-full text-base focus:outline-none"
          placeholder="Nhập @, tin nhắn..."
          maxLength={100}
          value={Utils.convertMsgContent(textContent)}
          onChange={(e) => setTextContent(e.target.value)}
          // onFocus={() => setIsInputFocus(true)}
          // onBlur={() => setIsInputFocus(false)}
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
              sendTextMessage({ roomId, content })
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
              sendTextMessage({ roomId, content: data.content })
            }
          }}
        />
      </div>
    </div>
  )
}

const MessageItem = memo(
  ({
    data,
    isLeader,
    msgRep,
    isShowTime,
    isShowAvatar,
    avatarUrl,
    setMsgRep,
    status,
    isSelfSent,
    isShowStatus,
  }) => {
    const { content, type, sender, createdAt } = data

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
            {isShowAvatar && (
              <div class="relative">
                <img
                  className="size-10 rounded-full"
                  src={avatarUrl}
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
            className={`rounded border-2 border-slate-300 bg-white p-2 ${!isSelfSent ? 'ml-2' : 'mr-2'}`}
          >
            {msgRep && (
              <div className="rounded-md p-2">
                <p className="font-bold">Nghĩa</p>
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
              <p className="min-w-12 max-w-80 break-words">{content}</p>
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
              <p className="font-mono text-xs">{Utils.timeToMmSs(createdAt)}</p>
            )}
          </div>
          {isHovered && (
            <div onClick={() => setMsgRep(data)}>
              <img
                className="size-4 rounded-full"
                src={sender?.user?.avatarUrl}
                alt="Placeholder"
              />
            </div>
          )}
        </div>
        <div className={`flex ${isSelfSent && 'flex-row-reverse'}`}>
          {isShowStatus && (
            <p className={`rounded-md bg-dark-5 p-1 text-xs text-white`}>
              {status ? 'Đã nhận' : 'Đã gửi'}
            </p>
          )}
        </div>
      </div>
    )
  }
)

export default ConversationContent

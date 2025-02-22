import { useEffect, useRef, useState, memo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Assets } from '../../assets'
import { useDispatch, useSelector } from 'react-redux'
import SquareIcon from '../../components/icon/squareIcon'
import useSocketEvent from '../../hooks/useSocket'
import { useSocket } from '../../socket/SocketProvider'
import Utils from '../../utils/utils'
import {
  addNewMgs,
  getRoomById,
  getRoomByPartnerId,
  loadMessagesFrom,
  loadMoreMessages,
  resetRoom,
  sendTextMsg,
  setMsgReply,
} from '../../redux/slices/currentRoomSlice'
import { useLocation, useParams } from 'react-router-dom'
import { emitEvent } from '../../socket/socket'
import { useCallback } from 'react'
import { setViewAllMsg, updateLastMsgForRoom } from '../../redux/slices/roomSlice'

const ConversationContent = () => {
  const dispatch = useDispatch()
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search)
  const type = queryParams.get('type')
  const { id } = useParams()

  const [isLoading, setIsLoading] = useState(true)
  // const [roomId, setRoomId] = useState(null)
  const roomId = useSelector((state) => state.currentRoom.roomId)
  // let membersObj = {}
  // members.forEach((mem) => {
  //   membersObj[mem.id] = mem
  // })
  console.log('re-render-ConversationContent')

  //   if (roomId) {
  //   useSocketEvent('writing_message', (data) => {
  //     // setpartnerWriting(data)
  //   })
  // }
  // useSocketEvent('load_more_msgs_when_connect', (data) => {
  //   console.log('after connect', data)
  // })
  // useSocketEvent('received_msg', (data) => {
  //   console.log('received_msg', data)
  //   dispatch(setReceiver(data))
  // })
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

  // useEffect(() => {
  //   if (room?.type == RoomTypeEnum.GROUP) {
  //     const leader = members.filter((m) => m.role == RoomRoleEnum.LEADER)[0]
  //     if (leader) {
  //       setLeader(leader)
  //     }
  //   }
  // }, [])

  //-------------------------------------------------
  useEffect(() => {
    //rời phòng chat và dọn dẹp dữ liệu cũ
    dispatch(resetRoom())
    emitEvent('message','leave-room', { roomId: roomId })
    if (type != 'room') {
      dispatch(getRoomByPartnerId({ partnerId: id }))
    } else {
      dispatch(getRoomById({ roomId: id }))
    }
  }, [location])

  useEffect(() => {
    if (roomId) {
      emitEvent('message','join-room', { roomId: roomId })
      setIsLoading(false)      
    }
  }, [roomId])

  return (
    <div className="flex flex-1 flex-row">
      {isLoading ? (
        <p>Loading.....</p>
      ) : (
        <>
          <div className="flex w-full flex-col">
            <Header />
            <div className="h-0.5 w-full bg-slate-400" />
            <Content roomId={roomId} />
            <Input roomId={roomId} />
          </div>
          <div className="h-full w-0.5 bg-slate-400" />
          {/* {room && <ConversationInfo room={room} />} */}
        </>
      )}
    </div>
  )
}

const Header = () => {
  const roomName = useSelector((state) => state.currentRoom.roomName)
  const roomAvatarUrl = useSelector((state) => state.currentRoom.roomAvatarUrl)
  return (
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
  )
}

const Content = ({ roomId }) => {
  const dispatch = useDispatch()  
  const messages = useSelector((state) => state.currentRoom.messages)
  const pagination = useSelector((state) => state.currentRoom.pagination)
  const members = useSelector((state) => state.currentRoom.members)
  const memberId = useSelector((state) => state.currentRoom.memberId)
  const itemRefs = useRef([])
  const [msgScroll, setMsgScroll] = useState(false)

  console.log('Conntent rẻ-render')

  let membersObj = {}
  members.forEach((mem) => {
    membersObj[mem.id] = mem
  })

  console.log('membersObj', membersObj)

  useSocketEvent('writing_message', (data) => {
    setpartnerWriting(data)
  })

  

  // useCallback(
  //   () => {
  //     first
  //   },
  //   [second],
  // )
  

  const onReplyItemClick = useCallback(({ messageId }) => {
    const index = messages.findIndex((m) => m.id == messageId)

    //nếu index ko có thì load và scroll
    if (index == -1) {
      dispatch(loadMessagesFrom({ roomId, messageId }))
      setMsgScroll(messageId)
    } else if (index + 7 < messages.length) {
      itemRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  })

  const loadOlderMessages = () => {
    if (pagination.afterCursor) {
      dispatch(
        loadMoreMessages({ roomId, afterCursor: pagination.afterCursor })
      )
    }
  }

  const loadNewerMessages = () => {
    if (pagination.beforeCursor) {
      dispatch(
        loadMoreMessages({ roomId, beforeCursor: pagination.beforeCursor })
      )
    }
  }
  const handleScroll = (e) => {
    if (e.target.scrollTop == 0) loadNewerMessages()
  }

  useEffect(() => {
    if (msgScroll) {
      const index = messages.findIndex((m) => m.id == msgScroll)
      if (index !== -1) {
        itemRefs.current[index]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }
    setMsgScroll(null)
  }, [messages])

  useEffect(() => {
    if (roomId) {
      dispatch(loadMoreMessages({ roomId }))
      dispatch(setViewAllMsg({ roomId }))
    }

    
  }, [roomId])

  useEffect(() => {
    return () => {
      dispatch(resetRoom())
    }
  },[])

  return (
    <>
      <div
        id="scrollableDiv"
        onScroll={handleScroll}
        className="flex h-full flex-col-reverse overflow-auto bg-slate-100"
      >
        {/*Put the scroll bar always on the bottom*/}
        <InfiniteScroll
          dataLength={messages.length}
          next={loadOlderMessages}
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
            const isFirstMsgEachMember =
              senderId != messages[index + 1]?.sender.id
            const isSelfSent = senderId == memberId
            return (
              <div key={item.id} ref={(el) => (itemRefs.current[index] = el)}>
                <MessageItem
                  id={item.id}
                  content={item.content}
                  type={item.type}
                  sender={item.sender}
                  createdAt={item.createdAt}
                  isShowTime={index == 0 || isLastMsgEachMember}
                  isShowAvatar={isFirstMsgEachMember && !isSelfSent}
                  // isShowStatus={senderId == memberId && index == 0}
                  isSelfSent={isSelfSent}
                  // status={members.some(
                  //   (m) =>
                  //     new Date(m?.msgRTime).getTime() >=
                  //       new Date(item.createdAt).getTime() && m.id != memberId
                  // )}
                  onReplyItemClick={onReplyItemClick}
                  avatarUrl={membersObj[senderId]?.user?.avatarUrl}
                  // // isLeader={senderId == leader?.id}
                  msgRep={item.replyMessage}
                />
              </div>
            )
          })}
        </InfiniteScroll>
      </div>
      <WritingCompoent memberId={memberId} />
    </>
  )
}

const WritingCompoent = ({ memberId }) => {
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

const Input = ({ roomId }) => {
  const dispatch = useDispatch()
  const msgReply = useSelector((state) => state.currentRoom.msgReply)
  const membersObj = useSelector((state) => state.currentRoom.membersObj)

  const [textContent, setTextContent] = useState('')

  const handleFileChange = async (event) => {
    // SendMessage({ files: event.target.files })
  }

  const cancelReply = () => {
    dispatch(setMsgReply(null))
  }

  const sendTextMessage = async () => {
    dispatch(
      sendTextMsg({
        roomId,
        data: {
          content: textContent,
          ...(msgReply && { replyMessageId: msgReply.replyMessageId }),
        },
      })
    )
    setTextContent('')
    cancelReply(null)
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
      {msgReply && (
        <div className="m-4 flex flex-row gap-4 rounded-md bg-gray-zalo-lighter p-2">
          <div className="h-12 w-1 rounded-md bg-zalo-primary" />
          <div className="flex flex-1 flex-col">
            <div className="flex flex-row gap-1">
              <p className="text-gray-zalo-dark">{`Trả lời`}</p>
              <p className="font-bold text-gray-zalo-darker">
                {membersObj[msgReply.sender.id].user.ussername}
              </p>
            </div>
            <p className="text-gray-zalo-dark">{msgReply.content}</p>
          </div>
          <p
            onClick={cancelReply}
            className="cursor-pointer font-medium text-red-600"
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendTextMessage()
            }
          }}
        />
        <img
          className="size-6"
          src={textContent.length > 0 ? Assets.icons.send : Assets.icons.like}
          onClick={() => {
            if (textContent.length > 0) {
              sendTextMessage()
            }
          }}
        />
      </div>
    </div>
  )
}

const MessageItem = memo(
  ({
    id,
    content,
    type,
    createdAt,
    isSelfSent,
    sender,
    // data,
    // isLeader,
    msgRep,
    isShowTime,
    isShowAvatar,
    avatarUrl,
    // setMsgRep,
    // status,

    // isShowStatus,
    onReplyItemClick,
  }) => {
    const dispatch = useDispatch()
    // const { content, type, createdAt } = data

    const [isHovered, setIsHovered] = useState(false) // Trạng thái hover
    const ref = useRef(null)

    console.log('load l ại')

    const setMessageReply = () => {
      dispatch(
        setMsgReply({
          replyMessageId: id,
          content: content,
          sender: sender,
        })
      )
    }

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
                {/* {isLeader && (
                  <img
                    className="absolute left-5 top-7 size-4"
                    src={Assets.icons.roomLeaderKey}
                    alt="Placeholder"
                  />
                )} */}
              </div>
            )}
          </div>
          <div
            className={`rounded border-2 border-slate-300 p-2 ${isSelfSent ? 'mr-2 bg-blue-100' : 'ml-2'}`}
          >
            {msgRep && (
              <div
                className={`flex cursor-pointer flex-row gap-2 rounded-md pr-2 ${isSelfSent ? 'bg-blue-200' : 'bg-gray-200'}`}
                onClick={() => onReplyItemClick({ messageId: msgRep.id })}
              >
                <div className="h-14 w-1 rounded-md bg-blue-600" />
                <div className="flex flex-col">
                  <p className="items-end font-bold">Nghĩa</p>
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
            <div
              className="mx-2 flex flex-row items-end gap-2"
              // onClick={() => setMsgRep(data)}
            >
              <IconOptionMsg
                onClick={setMessageReply}
                url={Assets.icons.quotesSecond}
                hoverUrl={Assets.icons.quotesPrimary}
              />
              <IconOptionMsg
                url={Assets.icons.forwardSecond}
                hoverUrl={Assets.icons.forwardPrimary}
              />
              <IconOptionMsg
                url={Assets.icons.moreSecond}
                hoverUrl={Assets.icons.morePrimary}
              />
            </div>
          )}
        </div>
        {/* <div className={`flex ${isSelfSent && 'flex-row-reverse'}`}>
          {isShowStatus && (
            <p className={`rounded-md bg-dark-5 p-1 text-xs text-white`}>
              {status ? 'Đã nhận' : 'Đã gửi'}
            </p>
          )}
        </div> */}
      </div>
    )
  }
)

const IconOptionMsg = ({ url, hoverUrl, onClick }) => {
  const [isHovered, setIsHovered] = useState(false)
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
    <img
      className="size-6 cursor-pointer rounded-full border border-gray-200 bg-white p-1"
      ref={ref}
      onClick={onClick}
      src={isHovered ? hoverUrl : url}
      alt="Placeholder"
    />
  )
}

export default ConversationContent

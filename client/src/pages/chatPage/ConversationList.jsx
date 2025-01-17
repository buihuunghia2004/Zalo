import { useEffect, useState } from 'react'
import SquareIcon from '../../components/icon/squareIcon'
import { AddFriendModal } from '../../components/modal/AddFriendModal'
import { Assets } from '../../assets'
import { useSelector } from 'react-redux'
import Utils from '../../utils/utils'

export default function ConversationList({ rooms, setCurrentConversation }) {
  const [isModalOpen, setIsModelOpen] = useState(false)  
  const meId = useSelector((state) => state.me.user?.id)

  return (
    <div className="flex w-[28rem] flex-col">
      {/* header */}
      <div className="mb-0.5 flex h-28 flex-col justify-between bg-dark-3 px-4 pt-4">
        <div className="flex flex-row">
          <Search />
          <SquareIcon
            onClick={() => setIsModelOpen(true)}
            src={Assets.icons.addFriend}
            className={'mx-1'}
          />
          <SquareIcon src={Assets.icons.addGroup} />
          <AddFriendModal isOpen={isModalOpen} setIsOpen={setIsModelOpen} />
        </div>
        <SelectedTab />
      </div>
      {/* content */}
      <div className="flex-grow bg-dark-3">
        {rooms.map((item, index) => (
          <ConversationItem
            key={index.toString()}
            data={item}
            lastMsg={item.lastMsg}
            messLasted={item.lastMsg.createdAt}
            msgReceived={item.receivedMsgs}
            isSelfSent={item.lastMsg?.isSelfSent}
            onClick={() => setCurrentConversation(item)}
          />
        ))}
      </div>
    </div>
  )
}
const Search = () => {
  const [isFocus, setIsFocus] = useState(false)

  return (
    <div
      className={`${
        isFocus && 'outline outline-1 outline-sky-400'
      } flex w-full flex-row rounded-lg bg-dark-2 px-1`}
    >
      <SquareIcon src={Assets.icons.search} />
      <input
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        className="search-input w-full bg-dark-2 text-white focus:outline-none"
        placeholder="Tìm kiếm"
      />
    </div>
  )
}
const SelectedTab = () => {
  const items = ['Tất cả', 'Chưa đọc']
  const [isSelected, setIsSelected] = useState(items[0])
  return (
    <div className="flex gap-3">
      {items.map((item, index) => (
        <div
          key={index.toString()}
          className=""
          onClick={() => setIsSelected(item)}
        >
          <p
            className={`text-sm font-semibold hover:text-blue-500 ${isSelected === item ? 'text-blue-500' : 'text-slate-400'}`}
          >
            {item}
          </p>
          {isSelected === item && <div className="h-1 bg-blue-500" />}
        </div>
      ))}
    </div>
  )
}
const ConversationItem = ({ id, data, isSelfSent, lastMsg, messLasted, msgReceived, onClick }) => {  
  const [isHover, setIsHover] = useState(false)
  const [timeDifference, setTimeDifference] = useState('');

  useEffect(() => {
    // Cập nhật ngay lập tức
    setTimeDifference(Utils.getTimeDifferenceFromNow(messLasted));

    // Thiết lập cập nhật mỗi phút
    const intervalId = setInterval(() => {
      setTimeDifference(Utils.getTimeDifferenceFromNow(messLasted));
    }, 60 * 1000);

    // Dọn dẹp interval khi component bị unmount
    return () => clearInterval(intervalId);
  }, [messLasted]);

  return (
    <div
      className="flex h-20 w-full flex-row items-center p-2 pr-4 hover:bg-dark-4"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={onClick}
    >
      <img
        className="size-12 rounded-full"
        src={data.roomAvatarUrl}
        alt="Placeholder"
      />
      <div className='w-full'>
        <div className="mx-2 flex w-full flex-row gap-1 py-1">
          <p className="text-base text-white w-full">{data.roomName}</p>
          {isHover ? (
            <SquareIcon className={'size-6'} src={Assets.icons.more} />
          ) : (
            <p className="text-sm text-slate-400">{timeDifference}</p>
          )}
        </div>
        <div className="flex flex-row mx-2 w-full gap-1 py-1">
          <p className="text-sm text-slate-400 flex-1">{
          (isSelfSent ? 'Bạn: ' : '' ) +
          (lastMsg?.type == 'text' ? lastMsg?.content : 'Hình ảnh')
          }</p>
          {
           msgReceived && Array.isArray(msgReceived) && msgReceived.length > 0 &&
           <>
            <p className="text-sm size-5 text-center text-white rounded-full bg-red-600">{msgReceived.length}</p>
           </>
          }
        </div>
      </div>
    </div>
  )
}

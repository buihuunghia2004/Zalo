import { useState } from "react"
import FriendInviteTab from "./FriendInviteTab"
import FriendListTab from "./FriendListTab"
import GroupListTab from "./GroupListTab"

const menus = [
  'Danh sách bạn bè',
  'Danh sách nhóm và cộng đồng',
  'Lời mời kết bạn',
  'Lời mời vào nhóm và cộng đồng',
]
const ItemMenuContact = ({ text, onClick, isActive }) => {
  return (
    <div className={`p-4 hover:bg-slate-500  ${isActive && 'bg-slate-700'}`} onClick={() => onClick()}>
      <p className="text-lg font-semibold text-white">{text}</p>
    </div>
  )
}

export default function ContactPage() {
  const [activeItem, setActiveItem] = useState(menus[0])
  const getContent = () => {
    if (activeItem == menus[0]) {
      return <FriendListTab/>
    }else if (activeItem == menus[1]) {
      return <GroupListTab/>
    }else if (activeItem == menus[2]) {
      return <FriendInviteTab/>
    }
  }
  return (
    <div className="flex size-full flex-row bg-dark-2">
      <div className="flex w-[28rem] flex-col flex-grow bg-dark-3">
        {menus.map((item, index) => (
          <ItemMenuContact
            key={index}
            isActive={activeItem == item}
            text={item}
            onClick={() => setActiveItem(item)}
          />
        ))}
      </div>

      {/* nội dung */}
      <div className="flex w-full flex-row">
        {
          getContent()
        }
      </div>
    </div>
  )
}

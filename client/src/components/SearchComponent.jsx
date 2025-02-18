import { useEffect, useRef, useState } from 'react'
import { Assets } from '../assets'
import SquareIcon from './icon/squareIcon'
import { AddFriendModal } from './modal/AddFriendModal'
import { AddGroupModal } from './modal/AddGroupModal'
import { Button } from "@/components/ui/button"

export function ButtonDemo() {
  return <Button>Button</Button>
}

export const SearchComponent = () => {
  const [search, setSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const [isAFModalOpen, setIsAFModelOpen] = useState(false)
  const [isAGModalOpen, setIsAGModalOpen] = useState(false)

  const recentContacts = [
    { id: 1, name: 'Lê Tuấn Vũ', avatar: 'https://via.placeholder.com/50' },
    { id: 2, name: 'Hồ Hoàng Phú', avatar: 'https://via.placeholder.com/50' },
    {
      id: 3,
      name: 'Nguyễn Quốc Duy',
      avatar: 'https://via.placeholder.com/50',
    },
  ]

  return (
    <div>
      <div className="flex flex-row p-4 gap-2">
        <div
          className={`${
            isSearching && 'outline outline-1 outline-sky-400'
          } flex w-full flex-row rounded-lg bg-slate-200 px-1`}
        >
          <SquareIcon src={Assets.icons.search} />
          <input
            onFocus={() => setIsSearching(true)}
            className="search-input w-full bg-slate-200 focus:outline-none"
            placeholder="Tìm kiếm"
          />
        </div>
        {
          isSearching ?
          <Button onClick={()=>setIsSearching(false)}>Đóng</Button>
          :
          <>
            <SquareIcon
              onClick={() => setIsAFModelOpen(true)}
              src={Assets.icons.addFriend}
              className={'mx-1'}
            />
            <SquareIcon
              onClick={() => setIsAGModalOpen(true)}
              src={Assets.icons.addGroup}
            />
          </>
        }
        <AddFriendModal isOpen={isAFModalOpen} setIsOpen={setIsAFModelOpen} />
        <AddGroupModal isOpen={isAGModalOpen} setIsOpen={setIsAGModalOpen} />
      </div>
      {isSearching && (
        <div className="absolute h-full w-[22rem] bg-white p-4">
          <h2 className="text-lg font-semibold">Tìm gần đây</h2>
          <ul className="mt-2 space-y-2">
            {recentContacts.map((contact) => (
              <li
                key={contact.id}
                className="flex items-center space-x-3 rounded-lg p-2 hover:bg-gray-100"
              >
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="h-10 w-10 rounded-full"
                />
                <span className="text-gray-800">{contact.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

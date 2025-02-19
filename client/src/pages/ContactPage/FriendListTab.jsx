import React, { useEffect, useState } from 'react'
import relationAPI from '../../service/relationAPI'
import { Assets } from '../../assets'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmUnFriendDialog } from '../../components/alert-dialog/ConfirmUnFriendDialog'
  import { Toaster, toast } from "sonner";

const FriendListTab = () => {
  const [friends, setFriendList] = useState([])
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [isDeleteFriend, setIsDeleteFriend] = useState(null)
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')

  useEffect(() => {
    const fetchFriendList = async () => {
      let data = await relationAPI.getAllRelationsRequestAPI('friend')
      data = data.filter((friend) =>
        friend.user.username.toLowerCase().includes(search.toLowerCase())
      )
      data = data.sort((a, b) =>
        sortOrder === 'asc'
          ? a.user.username.localeCompare(b.user.username)
          : b.user.username.localeCompare(a.user.username)
      )
      setFriendList(data)
    }
    fetchFriendList()
  }, [])
  const handleDeleteFriend = async (friend) => {
    setSelectedFriend(friend)
    setIsDeleteFriend(true)
  }
  const deleteFriendSuccess = async () => {
    setFriendList(friends.filter((friend) => friend.id !== selectedFriend.id))
    setSelectedFriend(null)
    toast.success("Xoá bạn thành công!", {
      position: "top-center",
      duration: 2000,
    });
  }

  return (
    <div className="flex-1 flex-col rounded-lg bg-gray-100 p-4 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Danh sách bạn bè</h2>
      <input
        type="text"
        placeholder="Tìm bạn"
        className="mb-2 w-full rounded border p-2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        className="mb-2 rounded bg-blue-500 p-2 text-white"
        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
      >
        Sắp xếp: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
      </button>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id} className="flex items-center border-b p-2">
            <img
              src={friend.user.avatarUrl}
              alt={friend.name}
              className="mr-3 h-10 w-10 rounded-full"
            />
            <span className='flex-1'>{friend.user.username}</span>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <img
                  src={Assets.icons.moreSecond}
                  alt="Placeholder"
                  className="h-8 w-8 rounded-md p-2 hover:bg-slate-300"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Xem thông tin</DropdownMenuItem>
                <DropdownMenuItem>Phân loại</DropdownMenuItem>
                <DropdownMenuItem>Đặt tên gợi nhớ</DropdownMenuItem>
                <DropdownMenuItem>Chặn người này</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteFriend(friend)} className="text-red-500">
                  Xóa bạn
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
      </ul>

      {
        selectedFriend &&
        <ConfirmUnFriendDialog
          isOpen={isDeleteFriend}
          onClose={() => setIsDeleteFriend(null)}
          relationId={selectedFriend.id}
          onSuccess={deleteFriendSuccess}
          username={selectedFriend.user.username}
        />
      }
    </div>
  )
}

export default FriendListTab

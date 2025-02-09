import { useEffect, useState } from 'react'
import relationAPI from '../../service/relationAPI'
import messageAPI from '../../service/messageAPI'
import ConversationContent from '../chatPage/ConversationContent'
import ConversationInfo from '../chatPage/ConversationInfo'
import { Assets } from '../../assets'

const FriendListTab = () => {
  const [friendList, setFriendList] = useState([])
  const [curConver, setCurConver] = useState(null)
  const [partner, setPartner] = useState(null)

  const fetchFriendList = async () => {
    const data = await relationAPI.getAllRelationsRequestAPI('friend')
    setFriendList(data)
  }

  useEffect(() => {
    fetchFriendList()
  }, [])

  const onItemClick = async (partner) => {
    console.log('partner',partner);
    // const conversation = await messageAPI.loadMoreMessage('')
    setPartner(partner)
    // setCurConver(conversation)
  }

  return (
    <div className="h-full w-full gap-1">
      {partner ? (
        <div className="flex h-full w-full flex-row">
          {/* hội thoại */}
          <ConversationContent
            partnerId={partner?.id}
          />
        </div>
      ) : (
        friendList.map((item) => (
          <FriendItem
            item={item} 
            fetchFriendList={fetchFriendList} 
            onClick={onItemClick}
          />
        ))
      )}
    </div>
  )
}

export default FriendListTab

const FriendItem = ({ item, fetchFriendList, onClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleUnFriend = async (id) => {
    await relationAPI.unFriendAPI(id)
    fetchFriendList()
  }
  return (
    <div
      onClick={() => onClick(item.user)}
      className="flex h-24 flex-col items-center justify-center px-4 hover:bg-slate-200"
    >
      <div className="mb-1 flex h-full w-full flex-row items-center gap-4">
        <img className="size-14 rounded-full" src={item.user.avatarUrl} />
        <p className="w-full justify-center font-bold">
          {item.user.username}
        </p>
        {/* <img
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="h-8 w-8 rounded-md p-2 hover:bg-slate-300"
          src={Assets.icons.more}
        /> */}
      </div>
      <div className="h-[1px] w-full bg-dark-4" />
      {isModalOpen && (
        <div className="absolute right-20 rounded-md bg-dark-3 p-2">
          <p className="rounded-sm p-1 hover:bg-slate-400">
            Xem thông tin
          </p>
          <p
            onClick={(e) => {
              e.stopPropagation()
              handleUnFriend(item.id)
            }}
            className="rounded-sm p-1 text-red-600 hover:bg-slate-400"
          >
            Xóa bạn
          </p>
        </div>
      )}
    </div>
  )
}

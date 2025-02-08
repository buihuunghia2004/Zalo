import { useState } from "react"
import relationAPI from "../../service/relationAPI"
import { ActionHandleAddFriend } from "../../constants/appConstant"
import { useSelector } from 'react-redux'

const RelationStatus = {
  NOTTHING: 'notthing',
  PENDING: 'pending',
  ACCEPTED: 'accepted'
}

const WhoSent = {
  ME: 'me',
  PARTNER: 'partner',
}

export const AddFriendModalInfoContent = ({
  data
}) => {
  const {user} = data
  const [status, setStatus] = useState(data.status) 
  const [whoSent, setWhoSent] = useState(data.whoSent)
  const [relationId, setRelationId] = useState(data.id)
  const me = useSelector((state) => state.me.user)

  const getStatusName = ({status, whoSent}) => {    
    if (status == RelationStatus.NOTTHING) {
      return 'Kết bạn'
    }else if (status == RelationStatus.PENDING) {
      return whoSent == WhoSent.ME ? 'Hủy kết bạn' : 'Đồng ý'
    }else{
      return 'Gọi điện'
    }
  }

  const sendRequestAddFriend = async () => {    
    try {
      const data = await relationAPI.sendRequestAddFriendAPI({
        receiverId: user.id
      })
      setRelationId(data.id)
      setWhoSent(WhoSent.ME)
      setStatus(data.status)
    } catch (error) {
      
    }
  }

  const handleRequestAddFriend = async (relationId) => {
    try {
      await relationAPI.handleRequestAddFriendAPI({relationId, action: whoSent === WhoSent.ME ? ActionHandleAddFriend.REJECT : ActionHandleAddFriend.ACCEPT})
      setStatus(whoSent == WhoSent.ME ? RelationStatus.NOTTHING : RelationStatus.ACCEPTED)
    } catch (error) {
      
    }
  }

  const isMe = () => {
    console.log(me);
    
    return me.id == user.id
  }

    
  return (
    <>
      {/* Profile Image */}
      <div className="mt-4 flex justify-center">
        <img
          src={user.avatarUrl}
          alt="Avatar"
          className="h-32 w-32 rounded-full object-cover"
        />
      </div>

      {/* User Name */}
      <div className="mt-4 text-center">
        <h3 className="text-xl font-semibold">{user.username}</h3>
        {
          !isMe() && 
          <div className="mt-2 flex justify-center space-x-2">
            <button onClick={async () => {            
              if (status == RelationStatus.NOTTHING) {
                //có thể gửi y/c kết bạn
                await sendRequestAddFriend()
              }else if(status == RelationStatus.PENDING){
                await handleRequestAddFriend(relationId)
              }else{//accepted
                //có thể gọi điện
              }
            }} className="rounded-md bg-gray-600 px-4 py-2 hover:bg-gray-700">
              {getStatusName({status, whoSent})}
            </button>
            <button 
              onClick={()=> {}}
              className="rounded-md bg-blue-600 px-4 py-2 hover:bg-blue-700"
            >
              Nhắn tin
            </button>
          </div>
        }
      </div>

      {/* User Information */}
      <div className="space-y-2 p-4">
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">Giới tính</span>
          <span>{user.gender == 'male' ? 'Nam' : 'Nữ'}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">Ngày sinh</span>
          <span>{user.dob}</span>
        </div>
        <div className="flex justify-between pb-2">
          <span className="text-gray-400">Email</span>
          <span>{user.email}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="rounded-b-lg bg-gray-700 p-4 text-center">
        <p className="text-gray-400">Chưa có ảnh nào được chia sẻ</p>
      </div>
    </>
  )
}

import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import { AddFriendModalSearchContent } from './AddFriendModalSearchContent'
import { AddFriendModalInfoContent } from './AddFriendModalInfoContent'
import userAPI from '../../service/userAPI'
import relationAPI from '../../service/relationAPI'
import { RelationEnum } from '../../utils/enum'
import roomAPI from '../../service/roomAPI'
import MessageModal from './MessageModal'

Modal.setAppElement('#root')

const tabs = {
  search: { name: 'Thêm nhóm' },
  info: { name: 'Thông tin tài khoản' },
}

export const AddGroupModal = ({ isOpen, setIsOpen }) => {
  const closeModal = () => setIsOpen(false)
  const [dataSearch, setDataSearch] = useState(null)
  const [users, setUsers] = useState([])
  const [userIds, setUserIds] = useState([])
  const [grName, setGrName] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await relationAPI.getAllRelationsRequestAPI(
        RelationEnum.FRIEND
      )
      setUsers(users)
    }
    fetchUsers()
  }, [])

  const onUserChange = ({userId, checked}) => {    
    if (checked) {
      setUserIds([...userIds,userId])
    }else{
      const newUserIds = userIds.filter(id => id != userId)
      setUserIds(newUserIds)
    }
  }
  const createGroup = async () => {
    const newGroup = await roomAPI.createNewGroupdAPI({
      groupName: grName,
      userIds: userIds
    })

    console.log('newG',newGroup);
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      className="fixed inset-0 flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-md rounded-lg bg-gray-800 p-4 text-white">
        {/* Modal Header */}
        <div className="flex items-center border-b border-gray-700 p-4">
          <h2 className="w-full px-4 text-lg font-semibold">Thêm nhóm</h2>
          <button
            onClick={closeModal}
            className="text-2xl font-bold hover:text-gray-400"
          >
            &times;
          </button>
        </div>
        {/* body */}
        <div>
          <div className="flex flex-row my-4">
            <input
              id="input-text"
              type="text"
              value={grName}
              onChange={(e)=>setGrName(e.target.value)}
              className="w-full rounded-lg border bg-dark-4 border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tên nhóm"
            />
          </div>
          {users.map((item) => (
            <UserItem key={item.id} user={item.user} onChange={(userId, checked)=>onUserChange({ userId, checked })}/>
          ))}
        </div>
        {/* footer */}
        <div className="mt-6 flex justify-end space-x-3">
          <button className="rounded-md bg-dark-3 px-4 py-2 hover:bg-dark-4">
            Hủy
          </button>
          <button
            onClick={()=>createGroup()}
            disabled = {userIds <= 1}
            className={`rounded-md px-4 py-2 text-white 
              ${userIds.length > 1 ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-400 cursor-not-allowed'}
            `}
          >
            Tạo nhóm
          </button>
        </div>
      </div>
    </Modal>
  )
}

const UserItem = ({ user, onChange }) => {
  const [isCheck, setIsCheck] = React.useState(false);

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;    
    setIsCheck(checked);

    // Gọi callback onChange nếu được truyền vào
    if (onChange) {
      onChange(user.id, checked);
    }
  };

  return (
    <div className="flex flex-row items-center gap-4 py-2">
      <input
        checked={isCheck}
        onChange={handleCheckboxChange}
        type="checkbox"
        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <img
        className="h-10 w-10 rounded-full"
        src={user.avatarUrl}
        alt="Avatar"
      />
      <p className="flex-1">{user.username}</p>
    </div>
  );
};

export default UserItem;


import { RoomRoleEnum, RoomTypeEnum } from "../../utils/enum"

const ConversationInfo = ({room}) => {
  return (
    <div className="flex w-[30rem] flex-col">
      <div className="flex h-20 flex-col items-center justify-center bg-dark-3">
        <p className="text-lg font-bold text-cyan-50">{room.type == RoomTypeEnum.PERSONAL ? 'Thông tin hội thoại' : 'Thông tin nhóm'}</p>
      </div>
      <div className="mt-1 bg-dark-3 p-4">
        <p className="text-lg font-bold text-cyan-50 text-center">{room.roomName}</p>
      </div>
      { room.type == RoomTypeEnum.GROUP &&
        <div className="mt-1 bg-dark-3 p-4">
          <p className="text-lg font-bold text-cyan-50">Thành viên nhóm</p>
          <p className="text-base text-cyan-50">{room.members?.length + ` thành viên`}</p>
        </div>
      }
      { room.type == RoomTypeEnum.GROUP &&
        <div className="mt-1 bg-dark-3 p-4">
          <p className="text-base text-red-600 hover:bg-dark-4 p-1 rounded-sm cursor-pointer">Rời nhóm</p>
          <p className="text-base text-red-600 hover:bg-dark-4 p-1 rounded-sm cursor-pointer">Giải tán nhóm</p>
        </div>
      }
      {/* <div className="mt-1 bg-dark-3 p-4">
        <p className="text-lg font-bold text-cyan-50">Ảnh</p>
      </div>
      <div className="mt-1 bg-dark-3 p-4">
        <p className="text-lg font-bold text-cyan-50">Link</p>
      </div>
      <div className="mt-1 bg-dark-3 p-4">
        <p className="text-lg font-bold text-cyan-50">File</p>
      </div> */}
    </div>
  )
}

export default ConversationInfo
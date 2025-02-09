import { RoomRoleEnum, RoomTypeEnum } from "../../utils/enum"

const ConversationInfo = ({room}) => {
  return (
    <div className="flex w-[30rem] flex-col bg-slate-100">
      <div className="flex h-20 flex-col items-center justify-center bg-white">
        <p className="text-lg font-bold">{room.type == RoomTypeEnum.PERSONAL ? 'Thông tin hội thoại' : 'Thông tin nhóm'}</p>
      </div>
      <div className="mt-2 p-4 bg-white">
        <p className="text-lg font-bold text-center">{room.roomName}</p>
      </div>
      { room.type == RoomTypeEnum.GROUP &&
        <div className="mt-2 p-4 bg-white">
          <p className="text-lg font-bold">Thành viên nhóm</p>
          <p className="text-base">{room.members?.length + ` thành viên`}</p>
        </div>
      }
      { room.type == RoomTypeEnum.GROUP &&
        <div className="mt-2 p-4 bg-white">
          <p className="text-base p-1 text-red-600 hover:bg-slate-200 rounded-sm cursor-pointer">Rời nhóm</p>
          <p className="text-base p-1 text-red-600 hover:bg-slate-200 rounded-sm cursor-pointer">Giải tán nhóm</p>
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
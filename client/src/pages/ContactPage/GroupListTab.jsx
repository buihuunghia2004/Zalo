import { useEffect, useState } from "react"
import relationAPI from "../../service/relationAPI"
import messageAPI from "../../service/messageAPI"
import ConversationContent from "../chatPage/ConversationContent"
import ConversationInfo from "../chatPage/ConversationInfo"
import roomAPI from "../../service/roomAPI"

const GroupListTab = () => {
  const [groupList, setGroupList] = useState([])
  const [curConver, setCurConver] = useState(null)
  const [curRoomId, setCurRoomId] = useState(null)
  const [partner, setPartner] = useState(null)
  
  const fetchGroupList = async () => {
    const data = await roomAPI.getAllGroupAPI()
    setGroupList(data.data)
  }
  
  useEffect(() => {
    fetchGroupList()
  }, [])

  const onItemClick = async (partner) => {
    const conversation = await messageAPI.loadMoreMessage('')
    setPartner(partner)
    setCurConver(conversation)
  }
  
  return(
    <div className="w-full h-full gap-1">
      {
        curRoomId ?
        <div className="flex w-full h-full flex-row">
          {/* hội thoại */}
          <ConversationContent
            roomId={curRoomId}
          />
        </div>
        :
        groupList.map(item => 
          <div
            onClick={()=>setCurRoomId(item.id)}
            className="h-24 px-4 flex flex-col items-center justify-center hover:bg-slate-200">
            {/* <div className="w-full h-full mb-1 flex flex-col items-center"> */}
              {/* <img className="rounded-full size-14" src={item.user.avatarUrl}/> */}
              <p className=" font-bold text-lg w-full">{item.roomName}</p>
              <p className=" text-base w-full">{item.members?.length + ' thành viên'}</p>
            {/* </div> */}
            <div className="h-[1px] w-full bg-dark-5"/>
          </div>
        )
      }
    </div>
  )
}

export default GroupListTab
import { useEffect, useState } from "react"
import { InviteFriendCard } from "../../components/card/InviteFriendCard"
import relationAPI from "../../service/relationAPI"

const FriendInviteTab = () => {
  const [sentRequests, setSentRequests] = useState([])
  const [receivRequests, setReceivRequest] = useState([])

  const fetchData = async () => {
    const data = await relationAPI.getAllRelationsRequestAPI('pending')
    setReceivRequest(data.filter(item => item.inviter != 'self'))
    setSentRequests(data.filter(item => item.inviter == 'self'))
  }

  const onHandle = ({action, relationId}) => {
    if (action == 'accept') {
      
    }
  }

  useEffect(() => {    
    fetchData()
  }, [])
  
  return (
    <div className="p-4 flex flex-col">
      <p className="text-white">{`Lời mời đã nhận ( ${receivRequests.length} )`}</p>
      <div className="flex flex-row gap-4 mt-4">
        {
          (receivRequests && receivRequests.length > 0) &&
          receivRequests.map(item => {          
            return(
              <InviteFriendCard data={item}/>
            )
          })
        }
      </div>
      <p className="text-white">{`Lời mời đã gửi ( ${sentRequests.length} )`}</p>
      <div className="flex flex-row gap-4 mt-4">
        {
          (sentRequests && sentRequests.length > 0) &&
          sentRequests.map(item => {          
            return(
              <InviteFriendCard data={item}/>
            )
          })
        }
      </div>
    </div>
  )
}

export default FriendInviteTab
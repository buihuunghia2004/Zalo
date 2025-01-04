import relationAPI from "../../service/relationAPI"

export const InviteFriendCard = ({
  data
}) => {
  const {partner, sentBy, status, id} = data

  const onHandleRquest = async (action) => {
    try {
      await relationAPI.handleRequestAddFriendAPI({
        relationId: id,
        action: action
      })
    } catch (error) {
      
    }
  }
  return (
    <div className="bg-dark-3 w-72 h-32 rounded-md flex flex-col p-4">
      <div className="flex flex-row gap-2 mb-4">
        <img 
          className="size-10  rounded-lg"
          src={partner?.avatarUrl}
        />
        <p className="text-white">{partner?.username}</p>
      </div>

      {status === 'pending' &&
        (sentBy === 'me' ? 
          <button onClick={()=> onHandleRquest('revoke')} className="bg-dark-4 hover:bg-dark-5 text-white p-2 rounded-sm w-full">Thu hồi lời mời</button> :
          <div>
            <div className="flex flex-row gap-2">
              <button onClick={()=> onHandleRquest('accept')} className="bg-blue-900 text-white p-2 rounded-sm w-full">Đồng ý</button>
              <button onClick={()=> onHandleRquest('reject')} className="bg-dark-4 hover:bg-dark-5 text-white p-2 rounded-sm w-full">Từ chối</button>
            </div>
          </div>
        )
      }
    </div>
  )
}
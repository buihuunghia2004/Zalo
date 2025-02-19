import relationAPI from "../../service/relationAPI"

export const InviteFriendCard = ({
  data,
  onHandle
}) => {
  const {user, inviter, status, id} = data

  const onHandleRquest = async (action) => {
    try {
      await relationAPI.handleRequestAddFriendAPI({
        relationId: id,
        action: action
      })
      onHandle({
        relationId: id,
        action: action
      })
    } catch (error) {
      
    }
  }
  return (
    <div className="w-72 h-32 rounded-md flex flex-col p-4 bg-white">
      <div className="flex flex-row gap-2 mb-4">
        <img 
          className="size-10  rounded-lg"
          src={user?.avatarUrl}
        />
        <p className="">{user?.username}</p>
      </div>  

      {status === 'pending' &&
        (inviter === 'self' ? 
          <button onClick={()=> onHandleRquest('revoke')} className="hover:bg-dark-5  p-2 rounded-sm w-full">Thu hồi lời mời</button> :
          <div>
            <div className="flex flex-row gap-2">
              <button onClick={()=> onHandleRquest('accept')} className="bg-blue-600 hover:bg-blue-700 text-white  p-2 rounded-sm w-full">Đồng ý</button>
              <button onClick={()=> onHandleRquest('decline')} className="bg-slate-400 hover:bg-slate-600  p-2 rounded-sm w-full">Từ chối</button>
            </div>
          </div>
        )
      }
    </div>
  )
}
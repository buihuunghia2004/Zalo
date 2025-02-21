import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { SearchComponent } from '../components/SearchComponent'
import { useEffect } from 'react';

export default function ContactLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  console.log('contact-layout-re-render');
  

  const friendsPathName = `/contacts/friends`
  const invitesPathName = `/contacts/invites`

  useEffect(() => {
    navigate('/contacts/friends')
  }, [])
  

  return (
    <div className="flex size-full flex-row">
      <div className="flex w-[22rem] flex-col">
        <SearchComponent />
        <Link
          on
          className={`p-4 hover:bg-slate-200 ${location.pathname == friendsPathName && 'bg-blue-200'}`}
          to={friendsPathName}
        >
          Danh sách bạn bè
        </Link>
        <Link
          className={`p-4 hover:bg-slate-200 ${location.pathname == invitesPathName && 'bg-blue-200'}`}
          to={invitesPathName}
        >
          Lời mời kết bạn
        </Link>
      </div>
      <div className="h-full w-0.5 bg-slate-400" />
      {/* <div className="h-full w-0.5 bg-slate-400"/> */}
      <div className="flex flex-1 flex-row">
        <Outlet />
      </div>
    </div>
  )
}

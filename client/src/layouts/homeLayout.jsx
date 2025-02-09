import { useState } from 'react'
import { Assets } from '../assets'
import TaskBarMenuButton from '../components/button/taskBarMenuButton'
import { useDispatch, useSelector } from 'react-redux'
import LogoutModal from '../components/modal/LogoutModal'
import { logout } from '../redux/slices/userSlice'
import ChatPage from '../pages/ChatPage'
import ContactPage from '../pages/ContactPage/ContactPage'
import { SettingMenu } from '../components/menu/SettingMenu'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ClickMeMenu } from '../components/menu/ClickMeMenu'

export default function HomeLayout({ children }) {
  const menu = [
    {
      id: 'chat',
      iconActive: Assets.icons.chatActive,
      iconInActive: Assets.icons.chatInActive,
    },
    {
      id: 'contact',
      iconActive: Assets.icons.contact,
      iconInActive: Assets.icons.contactOutline,
    },
  ]
  const me = useSelector((state) => state.me.user)

  const [activeItem, setActiveItem] = useState(menu[0])
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const dispatch = useDispatch()

  const onLogout = async () =>{
    try {
      dispatch(logout())
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      
    }
  }

  const getChild = () => {
    if (activeItem.id == 'chat') {
      return <ChatPage/>
    }else if (activeItem.id == 'contact') {
      return <ContactPage/>
    }
  }

  return (
    <div className="flex h-screen w-screen flex-row">
      {/* thanh taskbar */}
      <div className="flex w-16 flex-col bg-blue-1 px-2 py-3">

        {/* avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <img 
              className="cursor-pointer rounded-full border-2 border-gray-500 object-cover" 
              src={me?.avatarUrl} />
          </DropdownMenuTrigger>
          <ClickMeMenu 
            onLogoutClick={() => setIsLogoutModalOpen(true)}
            username={me?.username}/>
        </DropdownMenu>

        {/* menu */}
        <div className="mt-8 h-full">
          {menu && menu.map((item) => (
            <TaskBarMenuButton
              key={item.id}
              onClick={() => setActiveItem(item)}
              isActive={item.id === activeItem.id}
              imgActive={item.iconActive}
              imgInActive={item.iconInActive}
              className="mb-4 h-12 w-12"
            />
          ))}
        </div>

        {/* menu setting */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <TaskBarMenuButton
                isActive={false}
                imgActive={Assets.icons.setting}
                imgInActive={Assets.icons.settingOutLine}
                className="mb-4 h-12 w-12"
              />
            </div> 
          </DropdownMenuTrigger>
          <SettingMenu onLogoutClick={() => setIsLogoutModalOpen(true)}/>
        </DropdownMenu>
      </div>

      {/* nội dung */}
      <div className="w-full">
        {getChild()}
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onRequestClose={() => setIsLogoutModalOpen(false)}
        onLogout={onLogout}/>
    </div>
  )
}

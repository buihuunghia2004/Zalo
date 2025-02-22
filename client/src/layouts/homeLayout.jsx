import { useEffect, useState } from 'react'
import { Assets } from '../assets'
import TaskBarMenuButton from '../components/button/taskBarMenuButton'
import { useDispatch, useSelector } from 'react-redux'
import LogoutModal from '../components/modal/LogoutModal'
import { SettingMenu } from '../components/menu/SettingMenu'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ClickMeMenu } from '../components/menu/ClickMeMenu'
import { NavLink, Outlet } from 'react-router-dom'
import { logout } from '../redux/slices/authSlice'
import { getMe } from '../redux/slices/userSlice'

export default function HomeLayout() {
  const me = useSelector((state) => state.user)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const dispatch = useDispatch()

  console.log('HomeLayout re-render');
  

  const onLogout = async () => {
    try {
      dispatch(logout())
      localStorage.clear()
      sessionStorage.clear()
    } catch (error) {}
  }

  useEffect(() => {
    dispatch(getMe())
  }, [])
  
  return (
    <div className="flex h-screen w-screen flex-row">
      {/* thanh taskbar */}
      <div className="flex w-16 flex-col bg-blue-1 px-2 py-3">
        {/* avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <img
              className="cursor-pointer rounded-full border-2 border-gray-500 object-cover"
              src={me?.avatarUrl}
            />
          </DropdownMenuTrigger>
          <ClickMeMenu
            onLogoutClick={() => setIsLogoutModalOpen(true)}
            username={me?.username}
          />
        </DropdownMenu>

        {/* menu */}
        <nav className="mt-8 flex h-full flex-col gap-2">
          <MenuNav
            to={"messages"}
            imgActive={Assets.icons.chatActive}
            imgInActive={Assets.icons.chatInActive}
          />
          <MenuNav
            to={"contacts"}
            imgActive={Assets.icons.contact}
            imgInActive={Assets.icons.contactOutline}
          />
        </nav>
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
          <SettingMenu onLogoutClick={() => setIsLogoutModalOpen(true)} />
        </DropdownMenu>
      </div>

      {/* nội dung */}
      <div className="w-full">
        <Outlet />
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onRequestClose={() => setIsLogoutModalOpen(false)}
        onLogout={onLogout}
      />
    </div>
  )
}
const MenuNav = ({ onClick, to, imgActive, imgInActive }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-md p-2 hover:bg-blue-800 ${isActive && 'bg-blue-800'}`
      }
      onClick={onClick}
    >
      {({ isActive }) => (
        <img
          className="size-8 align-middle"
          src={isActive ? imgActive : imgInActive}
          alt="Placeholder"
        />
      )}
    </NavLink>
  )
}

import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogTrigger
} from "@/components/ui/dialog"
import { ProfileDialog } from "../modal/ProfileModal"
export function ClickMeMenu({username,onLogoutClick}) {
  return (
    <>
      <DropdownMenuContent className="w-56 shadow-lg">
        <DropdownMenuLabel >{username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <p >Hồ sơ của bạn</p>
                </DialogTrigger>
                <ProfileDialog/>
              </Dialog>
            </>
          </DropdownMenuItem>
          <DropdownMenuItem >
            Cài đặt
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className='font-bold text-base text-red-500 hover:text-red-700'
          onClick={onLogoutClick}
        >
          <p className='font-bold text-base text-red-500 hover:text-red-700'>Đăng xuất</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
      
    </>
  )
}

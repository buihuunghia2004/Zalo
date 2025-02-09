import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

export const SettingMenu = ({
  onLogoutClick
}) => {
  return (
    <DropdownMenuContent className="w-56 shadow-lg">
      <DropdownMenuGroup>
        <DropdownMenuItem>
          🔒 Thông tin tài khoản
        </DropdownMenuItem>
        <DropdownMenuItem>
          ⚙️ Cài đặt
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      {/* <DropdownMenuGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>💾 Dữ liệu</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Email</DropdownMenuItem>
              <DropdownMenuItem>Message</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>More...</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem>
          New Team
          <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup> */}
      {/* <DropdownMenuSeparator /> */}
      <DropdownMenuItem onClick={onLogoutClick}>
        <p className='font-bold text-base text-red-500 hover:text-red-700'>Đăng xuất</p>
      </DropdownMenuItem>
  </DropdownMenuContent>
  )
}

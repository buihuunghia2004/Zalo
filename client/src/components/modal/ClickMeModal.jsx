export const ClickMeModal = ({
  username,
  onLogoutClick,
}) => {
  return(
    <div
      className="fixed top-0 left-16 w-56 rounded-lg bg-gray-800 text-white shadow-lg"
    >
      <ul className="space-y-1 p-2">
        <li className="rounded p-2 hover:bg-gray-700">
          <p className="font-bold text-lg">{username}</p>
        </li>
        <hr className="border-gray-600" />
        <li className="cursor-pointer rounded p-2 hover:bg-gray-700">
          Hồ sơ của bạn
        </li>
        <li className="cursor-pointer rounded p-2 hover:bg-gray-700">
          Cài đặt
        </li>
        <hr className="border-gray-600" />
        <li
          className="cursor-pointer rounded p-2 font-bold text-red-400 hover:bg-gray-700"
          onClick={onLogoutClick}
        >
          Đăng xuất
        </li>
      </ul>
    </div>
  )
}
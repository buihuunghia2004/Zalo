import { useState } from 'react'
import userAPI from '../../service/userAPI'
import { toast } from 'sonner'

export const AddFriendModalSearchContent = ({ onCancel, onSearch }) => {
  const [email, setEmail] = useState('')

  const handleSearch = async () => {
    try {
      const data = await userAPI.findUserByEmail(email)
      onSearch(data)
    } catch (error) {
      if (error.statusCode == 404) {
        toast.warning("Email này chưa tạo tài khoản hoặc không cho tìm kiếm!", {
          position: "top-center",
          duration: 2000,
        });
      }
    }
  }
  return (
    <>
      {/* Modal Body */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-md border px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <h3 className="mb-2 text-sm font-semibold text-gray-700">
          Kết quả gần nhất
        </h3>
        {/* Friend Suggestions */}
        <div className="space-y-3">
          <ResultRencentlySearchItem/>
          <ResultRencentlySearchItem/>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="rounded-md bg-gray-zalo-light px-4 py-2 hover:bg-gray-zalo-secondary"
        >
          Hủy
        </button>
        <button
          disabled={email.length == 0}
          onClick={handleSearch}
          className={`cursor-pointer rounded-md bg-zalo-primary px-4 py-2 text-white ${email.length == 0 ? 'bg-dark-5 text-dark-4' : 'hover:bg-blue-800'} `}
        >
          Tìm kiếm
        </button>
      </div>
    </>
  )
}

const ResultRencentlySearchItem = () => {
  return (
    <div className="flex items-center justify-between">
    <div className="flex flex-row gap-4">
      <span className="font-bold text-slate-600">Nhân</span>
      <span className="text-black">nhan2@gmail.com</span>
    </div>
    <button className="rounded-md border border-blue-600 px-3 py-1 text-sm font-bold text-blue-600 hover:bg-blue-300">
      Kết bạn
    </button>
  </div>
  )
  
}

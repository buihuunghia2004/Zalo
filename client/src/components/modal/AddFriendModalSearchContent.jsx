import { useState } from "react"
import userAPI from "../../service/userAPI";
import { useToast } from "@/hooks/use-toast"

export const AddFriendModalSearchContent = ({
  onCancel,
  onSearch
}) => {
  const [email, setEmail] = useState('')
  const { toast } = useToast()

  const handleSearch = async () => {
    try {
      const data = await userAPI.findUserByEmail(email)
      onSearch(data)
    } catch (error) {
      if (error.statusCode == 404) {
        toast({
          title: "Thông báo",
          description: "Email này chưa đăng ký tài khoản hoặc không cho tìm kiếm",
          duration: 2000
        })
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
          onChange={(e)=>setEmail(e.target.value)}
          className="text-black mb-4 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <h3 className="mb-2 text-sm font-semibold text-gray-700">
          Kết quả gần nhất
        </h3>
        {/* Friend Suggestions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-black">Nhân (+84) 0389 857 738</span>
            <button className="rounded-md border border-blue-600 px-3 py-1 text-sm text-blue-600 hover:bg-blue-300 font-bold">
              Kết bạn
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black">Khánh Linh (+84) 0327 056 892</span>
            <button className="rounded-md border border-blue-600 px-3 py-1 text-sm text-blue-600 hover:bg-blue-300 font-bold">
              Kết bạn
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black">Hà Đăng Mobile (+84) 0903 930 000</span>
            <button className="rounded-md border border-blue-600 px-3 py-1 text-sm text-blue-600 hover:bg-blue-300 font-bold">
              Kết bạn
            </button>
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="rounded-md  px-4 py-2 bg-gray-zalo-light hover:bg-gray-zalo-secondary"
        >
          Hủy
        </button>
        <button 
          disabled={email.length == 0}
          onClick={handleSearch} 
          className={`cursor-pointer rounded-md bg-zalo-primary px-4 py-2 text-white ${email.length == 0 ? 'bg-dark-5 text-dark-4' : 'hover:bg-blue-800' } `}>
          Tìm kiếm
        </button>
      </div>
    </>
  )
}

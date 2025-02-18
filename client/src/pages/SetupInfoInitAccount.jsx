import { useSelector } from 'react-redux'
import ImageUploadPreview from '../components/ImageUploadPreview'
import { useEffect, useState } from 'react'
import userAPI from '../service/userAPI'
import { useNavigate } from 'react-router-dom'

const DEFAUL_AVATAR_URL =
  'https://res.cloudinary.com/dwipnm04n/image/upload/v1733844415/b5gkpt6z0lktuufm4xex.png'

export default function SetupInitAccount() {
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(DEFAUL_AVATAR_URL)
  const [avatarPid, setAvatarPid] = useState('')
  const [dob, setDob] = useState(null)
  const [gender, setGender] = useState(null)
  const navigate = useNavigate()
  const email = useSelector(state => state.user?.email)  

  const handleSubmit = async () => {
    try {
      await userAPI.updateMe({
        username,
        avatarPid,
        avatarUrl,
        dob,
        gender
      })
      navigate('/')
      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (email) {
      navigate('/')
    }
  }, [email])
  

  const Title = ({ text }) => {
    return (
      <p className="mt-6 w-full text-lg font-semibold text-gray-700">{text}</p>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-r from-cyan-500 to-blue-500 p-8">
      <div className="flex w-2/5 flex-col items-center rounded-lg border-2 border-sky-500 bg-white p-10">
        {/* Ảnh đại diện */}
        <ImageUploadPreview
          url={avatarUrl}
          setUrl={(url) => setAvatarUrl(url)}
          setPid={(pid) => setAvatarPid(pid)}
        />
        <p className="mt-4 text-lg font-semibold text-gray-700">
          Chọn ảnh đại diện
        </p>
        <p className="mt-4 text-lg font-semibold text-gray-700">
          {email}
        </p>

        {/* Họ và Tên */}
        <Title text={'Họ và tên :'} />
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Họ và tên đệm"
          className="w-full rounded-lg border p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* Sinh nhật */}
        <Title text={'Sinh nhật :'} />
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          dateFormat="dd-MM-yyyy"
          placeholder="Chọn ngày"
          className="mt-2 w-full rounded-lg border p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Giới tính */}
        <div className="mt-8 flex w-full flex-row gap-4">
          <p className="h-full text-lg font-semibold text-gray-700">
            Giới tính :
          </p>
          <div className="flex gap-6">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                onChange={(e) => setGender(e.target.value)}
                type="radio"
                name="gender"
                value="male"
                className="h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Nam</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                selected={dob}
                onChange={(e) => setGender(e.target.value)}
                type="radio"
                name="gender"
                value="female"
                className="h-5 w-5 text-pink-600"
              />
              <span className="text-gray-700">Nữ</span>
            </label>
          </div>
        </div>

        {/* Nút Tiếp tục */}
        <button
          className="mt-10 w-full max-w-md rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 py-3 text-lg font-semibold text-white transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          onClick={() => handleSubmit()}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  )
}

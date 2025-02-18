import { Assets } from "../assets";

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:7777/api/v1/auth/google'
  }
  return (
    <div className="w-screen h-screen bg-blue-500 items-center flex flex-col gap-10 justify-center">
      <p className="text-8xl font-bold text-white">LAZO</p>
      <div
        onClick={()=>handleLogin()}
        className="flex flex-row bg-white w-96 p-4 rounded-2xl items-center gap-4"
      >
        <img className="size-12" src={Assets.icons.google}/>
        <p className="font-bold text-lg w-full content-center">Đăng nhập với google</p>
      </div>
    </div>
  )
}
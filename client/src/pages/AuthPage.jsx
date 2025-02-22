import React, { useState } from "react";
import { toast } from "sonner";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      return toast.error("Vui lòng điền đầy đủ thông tin.", {
        position: "top-center",
        duration: 2000,
      });
    }
    
    if (!validateEmail(email)) {
      return toast.error("Email không đúng định dạng.", {
        position: "top-center",
        duration: 2000,
      });
    }
    
    if (password.length < 6) {
      return toast.error("Mật khẩu phải có ít nhất 6 ký tự.", {
        position: "top-center",
        duration: 2000,
      });
    }
    
    setIsOtpSent(true);
    toast.success("Mã OTP đã được gửi đến email của bạn.", {
      position: "top-center",
      duration: 2000,
    });
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      return toast.error("Mã OTP không hợp lệ.", {
        position: "top-center",
        duration: 2000,
      });
    }
    toast.success("Xác thực thành công!", {
      position: "top-center",
      duration: 2000,
    });
    setIsOtpSent(false);
  };

  const handleLoginWithGG = () => {
    window.location.href = 'http://localhost:7777/api/v1/auth/google';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-700 gap-10 p-5">
      {/* <Toaster richColors /> */}
      <p className="text-7xl font-extrabold text-white">LA</p>
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-96">
        <h2 className="text-3xl font-bold text-center text-blue-600">Lazo</h2>
        <div className="flex justify-around mt-6 border-b pb-3">
          <button
            className={`pb-2 font-semibold text-lg transition ${isLogin ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => { setIsLogin(true); setIsOtpSent(false); }}
          >
            Đăng nhập
          </button>
          <button
            className={`pb-2 font-semibold text-lg transition ${!isLogin ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500'}`}
            onClick={() => { setIsLogin(false); setIsOtpSent(false); }}
          >
            Đăng ký
          </button>
        </div>
        {!isOtpSent ? (
          <form className="mt-6" onSubmit={isLogin ? handleRegister : handleRegister}>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {!isLogin && (
              <input
                type="text"
                placeholder="Tên của bạn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition">
              {isLogin ? "Đăng nhập" : "Đăng ký"}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <form className="mt-6" onSubmit={handleVerifyOtp}>
              <input
                type="text"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="w-full bg-green-600 text-white p-3 rounded-xl font-semibold text-lg hover:bg-green-700 transition">
                Xác thực OTP
              </button>
            </form>
            <button className="w-full bg-slate-400 text-white p-3 rounded-xl font-semibold text-lg hover:bg-slate-500 transition">
              Quay lại
            </button>
          </div>
        )}
        <div className="mt-6 text-center">
          <p className="text-gray-500">Hoặc</p>
          <button 
            onClick={handleLoginWithGG} 
            className="w-full flex items-center justify-center mt-3 p-3 border rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition">
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-6 h-6 mr-2" />
            Đăng nhập với Google
          </button>
        </div>
        {isLogin && (
          <p className="text-center text-blue-500 mt-4 cursor-pointer hover:underline">Quên mật khẩu?</p>
        )}
      </div>
      <p className="text-7xl font-extrabold text-white">ZÔ</p>
    </div>
  );
};

export default AuthPage;
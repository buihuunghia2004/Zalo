import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import GoogleCallbackPage from './pages/GoogleCallbackPage'
import SetupInitAccount from './pages/SetupInfoInitAccount'
import { NotFoundPage } from './pages/NotFoundPage'
import ChatPage from './pages/ChatPage'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getMe } from './redux/slices/userSlice'
import HomeLayout from './layouts/HomeLayout'
import { SocketProvider, useSocket } from './socket/SocketProvider'
import useSocketEvent from './hooks/useSocket'
import { Toaster } from "@/components/ui/toaster"

export default function App() {
  const dispatch = useDispatch()
  const accessToken = useSelector((state) => state.me.auth.accessToken)
  const email = useSelector((state) => state.me.user?.email)
  
  const PrivateRoute = ({ children }) => {
    useEffect(() => {
      dispatch(getMe())
    }, [])
    if (!accessToken) return <Navigate to="/login" />;    
    if (!email) return <Navigate to="/init" />;
    return children;
  };

  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Các trang yêu cầu đăng nhập */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <SocketProvider namespace={"message"}>
              <HomeLayout>
                <ChatPage/>
              </HomeLayout>
              </SocketProvider>
            </PrivateRoute>
          }
        />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
        <Route path="/init" element={<SetupInitAccount />} />

        {/* Route 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster/>
    </div>
  )
}

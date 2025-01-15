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

export default function App() {
  const dispatch = useDispatch()
  const accessToken = useSelector((state) => state.me.auth.accessToken)
  const email = useSelector((state) => state.me.user?.email)
  const meId = useSelector((state) => state.me.user?.id)
  const { emit } = useSocket();

  console.log('cccccccccccccc');
  

  // useEffect(() => {
  //   // Kết nối đến server
  //   const socket = io('http://localhost:7777/message', {
  //     transports: ['websocket'], // Ép buộc sử dụng WebSocket
  //   });
  //   const messageNamespace = io.of("/message");
  //   messageNamespace.

  //   // Lắng nghe sự kiện "connected"
  //   socket.on("connected", (data) => {
  //     console.log('message',data);
  //   });

  //   // Gửi một sự kiện tới server
  //   socket.emit("message", { content: "Hello from ReactJS" });

  //   // Lắng nghe sự kiện "newMessage"
  //   socket.on(`event:notify:${meId}:new_message`, (data) => {
  //     console.log("Received a new message:", data);
  //   });

  //   socket.on('newmessage', (data) => {
  //     console.log("Received a new message:", data);
  //   });
    
  //   console.log("meid:",meId);
    

  //   // Dọn dẹp kết nối khi component bị hủy
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  

  const PrivateRoute = ({ children }) => {
    useEffect(() => {
      dispatch(getMe())
    }, [])
    if (!accessToken) return <Navigate to="/login" />;    
    if (!email) return <Navigate to="/init" />;
    return children;
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Các trang yêu cầu đăng nhập */}
      <Route
        path="/"
        element={
          <PrivateRoute><SocketProvider namespace={"message"}>
            <HomeLayout>
                <ChatPage/>
            </HomeLayout></SocketProvider>
          </PrivateRoute>
        }
      />
      <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
      <Route path="/init" element={<SetupInitAccount />} />

      {/* Route 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

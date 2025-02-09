import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { authSelector } from '~/features/auth/authSlice';
import { _MessageSentReq, _MessageSentRes } from '~/features/message/dto/message.dto.parent';

const SERVER_URL = 'http://192.168.1.16:7777';  // URL của server của bạn

// Hook kết nối WebSocket và lắng nghe tin nhắn
const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const socketRef2 = useRef<Socket | null>(null);
  const {accessToken, user} = useSelector(authSelector);
  const [newMessages, setNewMessages] = useState<any[]>([]);

  useEffect(() => {        
    if (!socketRef.current) {      
      console.log('accessToken',accessToken);
      
      // Kết nối WebSocket và gửi kèm accessToken trong header
      socketRef.current = io('http://192.168.1.16:7777/message', {
        transports: ['websocket'],
        auth: { token: `Bearer ${accessToken}` }, 
      });
      socketRef2.current = io('http://192.168.1.16:7777', {
        transports: ['websocket'],
        auth: { token: `Bearer ${accessToken}` }, 
      });

      // Lắng nghe sự kiện tin nhắn của userId
      const handleNewMessage = (message: _MessageSentRes) => {
        setNewMessages(prevMessages => [...prevMessages, message]);
      };

      socketRef.current.on(`event:notify:${user}:new_message`, handleNewMessage);
    }

    // Cleanup khi component unmount hoặc khi userId hoặc accessToken thay đổi
    return () => {
      if (socketRef.current) {
        socketRef.current.off(`event:notify:${user}:new_message`);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user]); 

  // Trả về socket và danh sách tin nhắn
  return { socket: socketRef.current, newMessages };
};

export default useSocket;

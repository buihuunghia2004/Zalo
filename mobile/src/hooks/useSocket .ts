import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SERVER_URL = 'http://localhost:7777/message';  // URL của server của bạn

// Hook kết nối WebSocket và lắng nghe tin nhắn
const useSocket = (userId: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [newMessages, setNewMessages] = useState<any[]>([]);

  useEffect(() => {
    console.log("Kết nối với WebSocket...");

    if (!socketRef.current) {
      // Kết nối WebSocket và gửi kèm accessToken trong header
      socketRef.current = io(SERVER_URL, {
        transports: ['websocket'],
        auth: { token: 'a' }, // Gửi accessToken trong header của WebSocket
      });

      // Lắng nghe sự kiện tin nhắn của userId
      const handleNewMessage = (message: any) => {
        console.log('📩 Tin nhắn mới:', message);
        setNewMessages(prevMessages => [...prevMessages, message]);
      };

      socketRef.current.on(`message:${userId}`, handleNewMessage);
    }

    // Cleanup khi component unmount hoặc khi userId hoặc accessToken thay đổi
    return () => {
      console.log("Ngắt kết nối WebSocket...");
      if (socketRef.current) {
        socketRef.current.off(`message:${userId}`);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId]);  // Chạy lại khi userId hoặc accessToken thay đổi

  // Trả về socket và danh sách tin nhắn
  return { socket: socketRef.current, newMessages };
};

export default useSocket;

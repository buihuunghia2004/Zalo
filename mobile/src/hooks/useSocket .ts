import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const SERVER_URL = "http://localhost:3000";  // Thay bằng URL của server của bạn

// Hook quản lý kết nối và nhận tin nhắn từ WebSocket
const useSocket = (userId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [newMessages, setNewMessages] = useState<string[]>([]);

  useEffect(() => {
    // Kết nối đến server
    const socketInstance = io(SERVER_URL);

    // Lắng nghe sự kiện khi có tin nhắn mới từ server
    socketInstance.on(userId, (message: string) => {
      setNewMessages(prevMessages => [...prevMessages, message]);
    });

    // Lưu socket instance vào state
    setSocket(socketInstance);

    // Dọn dẹp khi component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  // Trả về chỉ danh sách tin nhắn
  return { newMessages };
};

export default useSocket;

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const SERVER_URL = "http://localhost:3000";

const useSocket = () => {
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // Kết nối đến server
    const socketInstance = io(SERVER_URL);
    setSocket(socketInstance);

    // Lắng nghe sự kiện từ server
    socketInstance.on('response', (data) => {
      console.log('Received response: ', data);
    });

    // Cleanup: Ngắt kết nối khi component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendMessage = (message: string) => {
    if (socket) {
      socket.emit('message', message);
    }
  };

  return { sendMessage };
};

export default useSocket;

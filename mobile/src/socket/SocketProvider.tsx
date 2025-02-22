
  import React, { createContext, useContext, useEffect, ReactNode, useState } from "react";
  import { connectSocket, disconnectSocket, emitEvent, onEvent, offEvent } from "./socket";
  import { useSelector } from "react-redux";
  import { authSelector } from "~/features/auth/authSlice";
  
  // Định nghĩa kiểu dữ liệu cho context
  interface SocketContextType {
    emit: (event: string, data: any) => void;
    on: (event: string, callback: (data: any) => void) => void;
    off: (event: string) => void;
    isConnected: boolean;
  }
  
  // Định nghĩa props của `SocketProvider`
  interface SocketProviderProps {
    namespace: string;
    children: ReactNode;
  }
  
  // Tạo context
  const SocketContext = createContext<SocketContextType | null>(null);
  
  // Hook sử dụng context
  export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (!context) {
      throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
  };
  
  // Component Provider
  export const SocketProvider: React.FC<SocketProviderProps> = ({ namespace, children }) => {
    const { accessToken } = useSelector(authSelector);
    const [isConnected, setIsConnected] = useState(false);
  
    useEffect(() => {
      const socket = connectSocket(namespace, accessToken ?? "");
  
      // Lắng nghe sự kiện connect/disconnect
      const handleConnect = () => setIsConnected(true);
      const handleDisconnect = () => setIsConnected(false);
  
      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
  
      return () => {
        // Cleanup khi unmount
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        disconnectSocket(namespace);
      };
    }, [namespace, accessToken]);

    // Đối tượng chứa các phương thức của socket
    const socketActions: SocketContextType = {
      emit: (event, data) => emitEvent(namespace, event, data),
      on: (event, callback) => onEvent(namespace, event, callback),
      off: (event) => offEvent(namespace, event),
      isConnected,
    };
  
    return <SocketContext.Provider value={socketActions}>{children}</SocketContext.Provider>;
  };
  
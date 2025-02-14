import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { connectSocket, disconnectSocket, emitEvent, onEvent, offEvent } from "./socket";
import { useSelector } from "react-redux";
import { authSelector } from "~/features/auth/authSlice";

// Định nghĩa kiểu dữ liệu cho context
interface SocketContextType {
  emit: (event: string, data: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string) => void;
}

// Tạo context với giá trị mặc định là `null`
const SocketContext = createContext<SocketContextType | null>(null);

// Hook sử dụng context
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

// Props của `SocketProvider`
interface SocketProviderProps {
  namespace: string;
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ namespace, children}) => {
  const { accessToken} = useSelector(authSelector)
  useEffect(() => {    
    connectSocket(namespace,accessToken ?? "");

    return () => {      
      disconnectSocket(namespace);
    };
  }, [namespace, accessToken]);

  const socketActions: SocketContextType = {
    emit: (event, data) => emitEvent(namespace, event, data),
    on: (event, callback) => onEvent(namespace, event, callback),
    off: (event) => offEvent(namespace, event),
  };

  return <SocketContext.Provider value={socketActions}>{children}</SocketContext.Provider>;
};

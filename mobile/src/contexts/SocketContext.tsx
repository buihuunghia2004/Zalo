import React, { createContext, useContext, useEffect, ReactNode, useState } from "react";
import { connectSocket, disconnectSocket, emitEvent, onEvent, offEvent } from "~/socket/socket";
import { useSelector } from "react-redux";
import { authSelector } from "~/features/auth/authSlice";
import { _MessageSentRes } from "~/features/message/dto/message.dto.parent";
import { syncMessageFromSocket } from "~/database/synchronous/MessageSync";
import BackgroundService from 'react-native-background-actions';
import userStatusService from '~/utils/userTimeLine';

interface SocketContextType {
  emit: (event: string, data: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string) => void;
  isConnected: boolean;
}

interface SocketProviderProps {
  namespace: string;
  children: ReactNode;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within a SocketProvider");
  return context;
};

import { AppState } from 'react-native';

// Trong SocketProvider
export const SocketProvider: React.FC<SocketProviderProps> = ({ namespace, children }) => {
  const { accessToken } = useSelector(authSelector);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = connectSocket(namespace, accessToken ?? "");

    const handleConnect = () => {
      console.log('Socket connected');
      setIsConnected(true);


      socket.on("newMessage", (msg: _MessageSentRes) => {
        syncMessageFromSocket(msg).catch((err) => console.log(err));
      });
      // userStatusService.setLastOnline();
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
      // userStatusService.setLastOffline();
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Theo dõi trạng thái ứng dụng
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background' ) {
        disconnectSocket(namespace); // Ngắt socket khi app thoát hoặc vào background
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove(); // Gỡ listener AppState
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("newMessage");
      disconnectSocket(namespace);
    };
  }, [namespace, accessToken]);

  const socketActions: SocketContextType = {
    emit: (event, data) => emitEvent(namespace, event, data),
    on: (event, callback) => onEvent(namespace, event, callback),
    off: (event) => offEvent(namespace, event),
    isConnected,
  };

  return <SocketContext.Provider value={socketActions}>{children}</SocketContext.Provider>;
};
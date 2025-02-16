import React, { createContext, useContext, useEffect } from "react";
import { connectSocket, disconnectSocket, emitEvent, onEvent, offEvent } from "./socket";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ namespace, children }) => {
  useEffect(() => {    
    connectSocket(namespace);

    return () => {
      disconnectSocket(namespace);
    };
  }, [namespace]);

  const socketActions = {
    emit: (event, data) => emitEvent(namespace, event, data),
    on: (event, callback) => onEvent(namespace, event, callback),
    off: (event) => offEvent(namespace, event),
  };

  return (
    <SocketContext.Provider value={socketActions}>
      {children}
    </SocketContext.Provider>
  );
};

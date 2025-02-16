import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

// Định nghĩa kiểu dữ liệu cho danh sách socket theo namespace
const sockets: Record<string, Socket> = {}; 

export const connectSocket = (namespace: string, accesstoken: string): Socket => {
  if (!sockets[namespace]) {   
     
    sockets[namespace] = io(`http://192.168.1.19:7777/${namespace}`, {
      transports: ["websocket"],
      auth: {
        token: `Bearer ${accesstoken ?? ""}`,
      },
    });

    // sockets[namespace].on("connect", () => {
    //   console.log(`Connected to namespace: ${namespace}`);
    // });

    // sockets[namespace].on("disconnect", () => {
    //   console.log(`Disconnected from namespace: ${namespace}`);
    // });
  }

  return sockets[namespace];
};

export const disconnectSocket = (namespace: string): void => {
  if (sockets[namespace]) {
    sockets[namespace].disconnect();
    delete sockets[namespace];    
  }
};

export const emitEvent = (namespace: string, event: string, data: any): void => {
  if (sockets[namespace]) {
    sockets[namespace].emit(event, data);
  }
};

export const onEvent = (namespace: string, event: string, callback: (data: any) => void): void => {
  if (sockets[namespace]) {
    sockets[namespace].on(event, callback);
  }
};

export const offEvent = (namespace: string, event: string): void => {
  if (sockets[namespace]) {
    sockets[namespace].off(event);
  }
};

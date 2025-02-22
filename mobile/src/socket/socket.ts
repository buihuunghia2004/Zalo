import { io, Socket } from "socket.io-client";

// Danh sách socket theo namespace
const sockets: Record<string, Socket> = {}; 

export const connectSocket = (namespace: string, accesstoken: string): Socket => {
  if (!sockets[namespace]) {   
    sockets[namespace] = io(`http://192.168.1.10:7777/${namespace}`, {
      transports: ["websocket"],
      auth: {
        token: `Bearer ${accesstoken ?? ""}`,
      },
    });

    sockets[namespace].on("connect", () => {
      console.log(`✅ Connected to namespace: ${namespace} at ${new Date().toISOString()}`);
    });

    sockets[namespace].on("disconnect", () => {
      console.log(`❌ Disconnected from namespace: ${namespace}`);
    });
  }

  return sockets[namespace];
};

export const disconnectSocket = (namespace: string): void => {
  if (sockets[namespace]) {
    sockets[namespace].removeAllListeners(); // ✅ Xóa hết sự kiện tránh rò rỉ bộ nhớ
    sockets[namespace].disconnect();
    delete sockets[namespace];    
  }
};

export const emitEvent = (namespace: string, event: string, data: any): void => {
  if (sockets[namespace]?.connected) {  // ✅ Kiểm tra socket đã kết nối chưa
    sockets[namespace].emit(event, data);
  } else {
    console.warn(`⚠️ Socket ${namespace} is not connected. Cannot emit event: ${event}`);
  }
};

export const onEvent = (namespace: string, event: string, callback: (data: any) => void): void => {
  if (sockets[namespace]?.connected) { // ✅ Kiểm tra trước khi đăng ký sự kiện
    sockets[namespace].on(event, callback);
  } else {
    console.warn(`⚠️ Cannot listen to event "${event}" because socket ${namespace} is not connected.`);
  }
};

export const offEvent = (namespace: string, event: string): void => {
  if (sockets[namespace]) {
    sockets[namespace].off(event);
  }
};

export const isSocketConnected = (namespace: string): boolean => {
  return sockets[namespace]?.connected ?? false;
};

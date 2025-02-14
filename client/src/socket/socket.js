import { io } from "socket.io-client";

const sockets = {}; // Lưu các kết nối theo namespace

export const connectSocket = (namespace) => {
  if (!sockets[namespace]) {    
    sockets[namespace] = io(`http://localhost:7777/${namespace}`, {
      transports: ["websocket"],
      auth: {
        token: `Bearer ${localStorage.getItem("accessToken")}`,
      }
    });

    sockets[namespace].on("connect", () => {
      console.log(`Connected to namespace: ${namespace}`);
    });

    sockets[namespace].on("disconnect", () => {
      console.log(`Disconnected from namespace: ${namespace}`);
    });
  }
  return sockets[namespace];
};

export const disconnectSocket = (namespace) => {
  if (sockets[namespace]) {
    sockets[namespace].disconnect();
    delete sockets[namespace];
  }
};

export const emitEvent = (namespace, event, data) => {
  if (sockets[namespace]) {
    sockets[namespace].emit(event, data);
  }
};

export const onEvent = (namespace, event, callback) => {
  if (sockets[namespace]) {
    sockets[namespace].on(event, callback);
  }
};

export const offEvent = (namespace, event) => {
  if (sockets[namespace]) {
    sockets[namespace].off(event);
  }
};

import { useEffect } from "react";
import { useSocket } from "../socket/SocketProvider";

// Xác định kiểu cho props của hook
type UseSocketEventProps<T> = {
  event: string;
  callback: (data: T) => void;
};

const useSocketEvent = <T>({ event, callback }: UseSocketEventProps<T>): void => {
  const { on, off } = useSocket();

  useEffect(() => {
    on(event, callback);
    
    return () => {
      off(event);
    };
  }, [event, callback, on, off]);
};

export default useSocketEvent;

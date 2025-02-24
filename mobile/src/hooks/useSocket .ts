import { useEffect } from "react";
import { useSocket } from "../socket/SocketProvider";

type UseSocketEventProps<T> = {
  event: string;
  callback: (data: T) => void;
};

const useSocketEvent = <T,>({ event, callback  }: UseSocketEventProps<T>) => {
  const { on, off, isConnected } = useSocket();
  
  useEffect(() => {
    if (!isConnected ) return;
    
    on(event, callback);

    return () => {
      off(event);
    };
  }, [event, callback, isConnected, on, off]);
};

export default useSocketEvent;

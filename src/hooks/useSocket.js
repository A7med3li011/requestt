import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "https://socket.request-sa.com";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, { transports: ["websocket"] });
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};

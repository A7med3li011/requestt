import { createContext, useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Listen for new notifications from the server via socket
    socket.on("notification_", (data) => {
      ("Data from socket:", data);

      if (data?.message) {
        const newNotification = {
          ...data,
        };

        // Add the notification if it's not a duplicate
        addNotification(newNotification);
      }
    });

    ("Connected to notifications socket");

    return () => {
      socket.off("notification_");
      ("Disconnected from notifications socket");
    };
  }, [socket]);

  const addNotification = (newNotification) => {
    if (newNotification && newNotification.message) {
      setNotifications((prevNotifications) => {
        const isDuplicate = prevNotifications.some(
          (notif) => notif._id === newNotification._id
        );

        if (!isDuplicate) {
         
          return [newNotification, ...prevNotifications];
        }

        return prevNotifications;
      });
    }
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, addNotification, setNotifications }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

// // Socket listener for new notifications
// useEffect(() => {
//   const socket = io(SOCKET_URL, {
//     query: { userId },
//   });

//   socket.on("notification_", (notification) => {
//     ("New notification from socket: ", notification);
//     addNotification(notification);
//   });

//   socket.on("connect", () => {
//     ("Socket connected successfully");
//   });

//   socket.on("disconnect", () => {
//     ("Socket disconnected");
//   });
//   return () => {
//     socket.disconnect();
//   };
// }, [userId]);

// if (!notifications.some((notif) => notif._id === data._id)) {
//   setNotifications((prev) => [data, ...prev]);
// }

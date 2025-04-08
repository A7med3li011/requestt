import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import NotificationItem from "../../Components/NotificationItem/NotificationItem";
import StatusHeader from "../../Components/StatusHeader/StatusHeader";
import { NotificationsContext } from "../../context/NotificationsContext";
import { getAllNotifications, MakeAllRead } from "../../Services/api";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "../../hooks/useSocket";
import Empty from "../../Components/empty/empty";
import { t } from "i18next";
import Loader from "../../Components/Loader/Loader";

// const SOCKET_URL = "https://socket.request-sa.com";
const Notifications = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user._id;
  // const socketURL = useSocket();
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState(7);
  const [error, setError] = useState(null);
  const { notifications, addNotification, setNotifications } =
    useContext(NotificationsContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const days = 90;
        const data = await getAllNotifications(token, userId, days);
        ("Fetched notifications: ", data);

        if (data?.results) {
          setNotifications(data.results);
        } else {
          setError("Failed to load notifications.");
        }
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to fetch notifications.");
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token, userId]);

  const handleDaysChange = (days) => {
    setSelectedDays(days);
  };

  const markAllAsRead = async () => {
    try {
      await MakeAllRead(token, userId, { isRead: true });

      // Update the state to mark all notifications as read
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) {
      console.error("Invalid date input:", isoString);
      return "Invalid Date";
    }

    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      console.error("Invalid time value for:", isoString);
      return "Invalid Date";
    }

    const options = {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead
  );
  // Buttons for filtering notifications
  const buttons = [
    { label: "7 Days", value: 7 },
    { label: "30 Days", value: 30 },
    { label: "90 Days", value: 90 },
  ];

  return (
    <div className="Notification">
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-bold m-2">All Notifications</h4>
        {unreadNotifications.length !== 0 && (
          <button
            className="text-gray underline underline-offset-1 text-sm font-normal m-2"
            onClick={async () => {
              await markAllAsRead();
            }}
          >
            {t("Make All Read")}
          </button>
        )}
      </div>

      <div className="content bg-white p-2 rounded-3xl h-[80vh] overflow-y-scroll">
        <div className="header my-2">
          <StatusHeader
            buttons={buttons}
            className="bg-white"
            onFilterChange={handleDaysChange}
            active_indicator={"!bg-red"}
            bar={"!bg-gray-100"}
          />
        </div>

        <div className="content">
          {loading ? (
            <Loader />
          ) : error ? (
            <p className="text-red text-center text-lg ">{error}</p>
          ) : notifications.length === 0 ? (
            <Empty paragraph={t("no notifications available")} />
          ) : (
            <AnimatePresence>
              {notifications
                .filter((notification) => notification?.message)
                .map((notification, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5 }}
                  >
                    <NotificationItem
                      key={notification?._id}
                      type={notification?.type}
                      message_en={t(notification?.message?.message_en)}
                      message_ar={t(notification?.message?.message_ar)}
                      isRead={notification?.isRead}
                      timestamp={
                        notification?.createdAt
                          ? formatDate(notification?.createdAt)
                          : new Date().toLocaleString()
                      }
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

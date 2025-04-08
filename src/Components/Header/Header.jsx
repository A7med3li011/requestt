import {
  MdDriveFolderUpload,
  MdInbox,
  MdNotificationsNone,
  MdOutlinePayment,
} from "react-icons/md";
import logo from "../../assets/images/transpairant_leatest.png";
import { IoSearch } from "react-icons/io5";
import "./style.scss";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import NotificationItem from "../NotificationItem/NotificationItem";
import { IoIosWarning, IoMdClose } from "react-icons/io";
import { TbRosetteDiscountCheck } from "react-icons/tb";
import { PiHeadset } from "react-icons/pi";
import { NotificationsContext } from "../../context/NotificationsContext";
import {
  getAllNotifications,
  getNotificationCounts,
  MakeAllRead,
  updateNotification,
} from "../../Services/api";
import { FaBarsStaggered } from "react-icons/fa6";
import { Drawer, IconButton } from "@material-tailwind/react";
import { CiGrid32, CiHome } from "react-icons/ci";
import { RiTeamFill } from "react-icons/ri";
import { GiSettingsKnobs } from "react-icons/gi";
import { LuLayoutDashboard } from "react-icons/lu";
const Header = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);
  const { notifications, addNotification, setNotifications } =
    useContext(NotificationsContext);
  const toggleNonfiction = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (index) => {
    setActiveIndex(index);
  };
  const [NotificationCounts, setNotificationCounts] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState({
    Home: NotificationCounts.home,
    Projects: NotificationCounts.projects,
    Inbox: 0,
    Drive: 0,
    Plan: 0,
    Team: 0,
    Settings: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;

      try {
        const data = await getNotificationCounts(token, user._id);
        setNotificationCounts(data);
        setNotificationsCount((prevNotifications) => ({
          ...prevNotifications,
          Home: data.home || 0,
          Projects: data.projects || 0,
        }));
        data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const lang = i18n.language || "en";
    setIsRTL(lang === "ar");
    document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [i18n.language]);

  const markAllAsRead = async () => {
    try {
      await MakeAllRead(token, user._id, { isRead: true });

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

  const items = [
    {
      title: t("Home"),
      icon: <CiHome className="sidebar_icon" />,
      path: "/",
      notificationCount: notificationsCount.Home,
    },
    {
      title: t("Projects"),
      icon: <CiGrid32 className="sidebar_icon" />,
      path: "/Projects",
      notificationCount: notificationsCount.Projects,
    },
    {
      title: t("Inbox"),
      icon: <MdInbox className="sidebar_icon" />,
      path: "/Inbox",
      notificationCount: notificationsCount.Inbox,
    },
    {
      title: t("Drive"),
      icon: <MdDriveFolderUpload className="sidebar_icon" />,
      path: "/DriveFiles",
      notificationCount: notificationsCount.Drive,
    },
    {
      title: t("SeePlan"),
      icon: <MdOutlinePayment className="sidebar_icon" />,
      path: "/SeePlans",
      notificationCount: notificationsCount.Plan,
    },
    {
      title: t("Team"),
      icon: <RiTeamFill className="sidebar_icon" />,
      path: "/Team",
      notificationCount: notificationsCount.Team,
    },
    {
      title: t("settings"),
      icon: <GiSettingsKnobs className="sidebar_icon" />,
      path: "/Settings",
      notificationCount: notificationsCount.Settings,
    },
  ];

  return (
    <div className="bg-white border border-light">
      <header className="flex justify-between align-center p-3 ">
        <div className="logo hidden md:flex items-center gap-2">
          <img
            src={logo}
            alt="logo"
            width={31}
            height={31}
            className="rounded-md "
          />
          <span className="font-inter font-bold text-sm ">Request</span>
        </div>
        <div className="mobile block md:hidden">
          <button onClick={openDrawer}>
            <FaBarsStaggered className="" />
          </button>
        </div>
        {/* <div className="search relative">
          <input
            type="text"
            placeholder={t("search")}
            className="search w-full text-sm text-gray border rounded-md  border-gray "
          />
          <span className="absolute top-3 ltr:left-10 rtl:right-16 flex items-center gap-2 text-gray ">
            <IoSearch className=" w-[17px] h-[17px]" />
          </span>
        </div> */}
        <div className="flex justify-between items-center gap-2">
          {user?.userType === "admin" && (
            <a
              href="http://62.72.32.44:8005/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Admin Dashboard"
            >
              <LuLayoutDashboard className="w-6 h-6 text-purple " />
            </a>
          )}
          {/* {user.notifications && ( */}
          <div className="notifications">
            <button onClick={toggleNonfiction}>
              <MdNotificationsNone className=" w-[34px] h-[34px]  relative" />
              {unreadNotifications.length !== 0 && (
                <span className="bg-red w-[10px] h-[10px] absolute rounded-full top-4 ltr:right-4 rtl:left-4"></span>
              )}
            </button>
            <div
              className={`notification-dropdown ${
                isOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2"
              } absolute ltr:right-3 top-12 rtl:left-3 w-[350px]  lg:w-[600px] h-[200px] lg:h-[300px] border border-gray bg-white shadow-lg rounded-xl mt-3 transition-all duration-300 z-50 flex flex-col`}
              onMouseLeave={() => setIsOpen(false)}
            >
              <div className="flex justify-between items-center m-2">
                <span className="text-purple-dark text-base font-bold">
                  {t("New for you")}
                </span>
                {unreadNotifications.length !== 0 && (
                  <button
                    className="text-gray underline underline-offset-1 text-sm font-normal m-2"
                    onClick={async () => {
                      await markAllAsRead();
                      setIsOpen(false);
                    }}
                  >
                    {t("Make All Read")}
                  </button>
                )}
              </div>

              <div className="relative flex-1 overflow-y-auto ">
                {unreadNotifications.length === 0 && (
                  <div className=" text-center mt-4">
                    {t("no new notifications")}
                  </div>
                )}
                {unreadNotifications
                  .filter((notification) => notification?.message)
                  .slice(0, 5)
                  .map((notification, idx) => (
                    <NotificationItem
                      key={idx}
                      type={notification?.type}
                      message_en={notification?.message?.message_en}
                      message_ar={t(notification?.message?.message_ar)}
                      timestamp={
                        notification?.createdAt
                          ? formatDate(notification?.createdAt)
                          : new Date().toLocaleString()
                      }
                      isRead={notification?.isRead}
                      showButtons={notification?.showButtons}
                    />
                  ))}
              </div>

              <div className="footer bg-linear_1 p-2 text-start rounded-b-xl">
                <Link
                  to="/Notifications"
                  className="text-white font-medium text-base"
                >
                  {t("Previous notifications")}
                </Link>
              </div>
            </div>
          </div>
          {/* )}  */}
        </div>
      </header>

      {/* mobile view (sidebar) */}
      
        <Drawer open={open} onClose={closeDrawer} className={`p-2  `}>
          <div className="mb-6 flex items-center justify-between ">
            <div className="logo flex items-center gap-2">
              <img
                src={logo}
                alt="logo"
                width={31}
                height={31}
                className="rounded-md "
              />
              <span className="font-inter font-bold text-sm ">Request</span>
            </div>
            <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
              <IoMdClose />
            </IconButton>
          </div>
          <div className="items flex flex-col gap-3">
            {items.map((item, index) => (
              <Link
                key={item.title}
                to={item.path}
                onClick={() => handleItemClick(index)}
                className={`text-sm font-semibold font-inter text-gray transition-custom duration-custom flex items-center gap-3 py-5 px-5 ${
                  index === activeIndex ? "item_sidebar" : ""
                }
              ${item.path === window.location.pathname ? "item_sidebar" : ""}
               `}
              >
                <span
                  className={`${index === activeIndex ? "icon" : ""}    ${
                    item.path === window.location.pathname ? "icon" : ""
                  }`}
                >
                  {item.icon}
                </span>
                <p> {item.title}</p>
                {item.notificationCount > 0 && (
                  <span className="Notifications rounded-full ltr:right-4 rtl:left-4 absolute w-8 h-8 bg-red-500 !text-red flex items-center justify-center">
                    {item.notificationCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </Drawer>
      </div>
   
  );
};

export default Header;

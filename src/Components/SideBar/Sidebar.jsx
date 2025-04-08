/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  MdDriveFolderUpload,
  MdInbox,
  MdKeyboardDoubleArrowLeft,
  MdLogout,
  MdOutlinePayment,
} from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { CiGrid32, CiHome } from "react-icons/ci";
import { GiSettingsKnobs } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./style.scss";
import Button from "../UI/Button/Button";
import { handleLogout } from "../../redux/services/authServices";
import avatar from "../../assets/images/Avatar.jpg";
import { t } from "i18next";
import { getNotificationCounts } from "../../Services/api";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Button as Btn,
} from "@material-tailwind/react";

const Sidebar = () => {
  const [Open, setOpen] = useState(false);
  const [OpenDialog, setOpenDialog] = useState(false);
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [NotificationCounts, setNotificationCounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  "NotificationCounts", NotificationCounts;

  const [notifications, setNotifications] = useState({
    Home: NotificationCounts.home,
    Projects: NotificationCounts.projects,
    Inbox: 0,
    Drive: 0,
    Plan: 0,
    Team: 0,
    Settings: 0,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleOpenDialog = () => setOpenDialog(!OpenDialog);

  const handleLogoutClick = () => {
    dispatch(handleLogout());
    navigate("/LogIn/Mail");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getNotificationCounts(token, user._id);
        setNotificationCounts(data);
        setNotifications((prevNotifications) => ({
          ...prevNotifications,
          Home: data.home || 0,
          Projects: data.projects || 0,
        }));
        data;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const items = [
    {
      title: t("Home"),
      icon: <CiHome className="sidebar_icon" />,
      path: "/",
      notificationCount: notifications.Home,
    },
    {
      title: t("Projects"),
      icon: <CiGrid32 className="sidebar_icon" />,
      path: "/Projects",
      notificationCount: notifications.Projects,
    },
    {
      title: t("Inbox"),
      icon: <MdInbox className="sidebar_icon" />,
      path: "/Inbox",
      notificationCount: notifications.Inbox,
    },
    {
      title: t("Drive"),
      icon: <MdDriveFolderUpload className="sidebar_icon" />,
      path: "/DriveFiles",
      notificationCount: notifications.Drive,
    },
    {
      title: t("SeePlan"),
      icon: <MdOutlinePayment className="sidebar_icon" />,
      path: "/SeePlans",
      notificationCount: notifications.Plan,
    },
    {
      title: t("Team"),
      icon: <RiTeamFill className="sidebar_icon" />,
      path: "/Team",
      notificationCount: notifications.Team,
    },
    {
      title: t("settings"),
      icon: <GiSettingsKnobs className="sidebar_icon" />,
      path: "/Settings",
      notificationCount: notifications.Settings,
    },
  ];

  const handleProfileClick = () => {
    setIsProfileActive(!isProfileActive);
  };

  const handleItemClick = (index) => {
    setActiveIndex(index);
  };
  const nameParts = user?.name?.split(" ") || [];
  const firstNameInitial = nameParts[0]?.[0] || "";
  const lastNameInitial = nameParts[1]?.[0] || "";

  return (
    <div className="Sidebar rtl:left-0">
      <div
        className={`bg-white  py-5 pt-8 relative transition-custom duration-500 hidden md:flex flex-col ${
          !Open ? "w-72" : "w-24"
        }`}
      >
        <MdKeyboardDoubleArrowLeft
          onClick={() => setOpen(!Open)}
          className={`bg-white rounded-full text-purple border border-purple p-1 text-3xl absolute ltr:-right-4 rtl:-left-3 top-20 cursor-pointer ${
            !Open && "rotate-180"
          }`}
        />
        <div
          className={`flex gap-2 items-center profile py-6 px-5 ${
            isProfileActive && "item_sidebar"
          }`}
        >
          <Link
            to="/Settings"
            state={{ tabIndex: 1 }}
            onClick={handleProfileClick}
            className="flex gap-2 items-center  "
          >
            <div className="relative">
              {user?.profilePic ? (
                <img
                  src={`https://api.request-sa.com/${user?.profilePic}`}
                  alt="avatar"
                  className="rounded-full  w-12 h-12 object-contain relative border border-solid  border-gray p-2"
                />
              ) : (
                <>
                  <span className="user-profile-image h-12 w-12 text-xl ">
                    {firstNameInitial}
                    {lastNameInitial}
                  </span>
                </>
              )}
              <span className="bg-green absolute rounded-full w-4 h-4 left-8 top-8"></span>
            </div>
            {!Open && (
              <div className="flex flex-col">
                <p className="name font-bold font-inter text-xs">
                  {user?.name}
                </p>
                {user?.role && user?.role?.jobTitle && (
                  <p className="role text-gray-500 font-bold font-inter text-xs text-gray">
                    {user?.role.jobTitle}
                  </p>
                )}
                {user?.companyName && (
                  <p className="role font-bold text-gray-500 font-inter text-xs text-gray">
                    {user?.companyName}
                  </p>
                )}
              </div>
            )}
          </Link>
        </div>
        <div
          className={`items w-full flex flex-col mt-5 gap-3 overflow-hidden`}
        >
          {items.map((item, index) => (
            <Link
              key={item.title}
              to={item.path}
              onClick={() => handleItemClick(index)}
              className={`text-sm font-semibold font-inter text-gray-500 transition-custom duration-custom flex items-center gap-3 py-3  px-5 ${
                index === activeIndex ? "item_sidebar" : ""
              }
              ${item.path === window.location.pathname ? "item_sidebar" : ""}
                 ${Open && "item_sidebar_close pl-7"}`}
            >
              <span
                className={`${index === activeIndex ? "icon" : ""}    ${
                  item.path === window.location.pathname ? "icon" : ""
                }`}
              >
                {item.icon}
              </span>
              <p className={`${Open && "scale-0"}`}> {item.title}</p>
              {!Open && item.notificationCount > 0 && (
                <span className="Notifications rounded-full ltr:right-4 rtl:left-4 absolute w-8 h-8 bg-red-500 !text-red flex items-center justify-center">
                  {item.notificationCount}
                </span>
              )}
            </Link>
          ))}
          {/* Logout Button */}
          {user ? (
            <button
              onClick={handleOpenDialog}
              className={`text-sm font-semibold font-inter text-gray transition-custom duration-custom flex items-center gap-3 py-5 px-5   ${
                Open && "item_sidebar_close pl-7"
              }`}
            >
              <span>
                <MdLogout className="w-6 h-6" />
              </span>
              {!Open && <span>{t("logout")}</span>}
            </button>
          ) : (
            <Button className="mt-auto w-full">
              <Link to="/SignUp/ChooseRole">{t("Sign Up")}</Link>
            </Button>
          )}
          <Dialog open={OpenDialog} handler={handleOpenDialog}>
            <DialogHeader className="font-semibold text-lg">
              {t("Are you sure you want to logout?")}
            </DialogHeader>
            <DialogBody className="text-base text-gray font-normal">
              <p>
                {t(
                  "If you log out, you will need to log in again to access the system."
                )}
              </p>
              <p>{t("Do you want to proceed with logging out?")}</p>
            </DialogBody>
            <DialogFooter>
              <Btn
                variant="text"
                color="red"
                onClick={handleOpenDialog}
                className="mr-1"
              >
                <span>{t("Cancel")}</span>
              </Btn>
              <button
                className="px-4 py-2 bg-linear_1 text-white rounded-xl font-semibold text-base"
                onClick={handleLogoutClick}
              >
                <span>{t("Confirm")}</span>
              </button>
            </DialogFooter>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

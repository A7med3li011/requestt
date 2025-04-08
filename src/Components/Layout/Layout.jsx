import { useLocation } from "react-router-dom";
import Sidebar from "../SideBar/Sidebar";
import Header from "../Header/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import AppRoutes from "../../Routes/AppRoutes";
import Footer from "../Footer/Footer";

const Layout = () => {
  const location = useLocation();
  // useAuthRedirect();
  const options = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  const noSidebarRoutes = [
    "/LogIn/Mail",
    "/LogIn",
    "/Otp",
    "/SignUp",
    "/SignUp/ChooseRole",
    "/SignUp/createCompany",
    "/forgotPassword",
    "/landing",
    "/landing/services",
    "/landing/ContactUs",
    "/landing/seePlans",
    // "/landing/plansDetails",
    "/landing/PlansInfo",
    "/landing/*",
    "/Invitation",
    "*",
    "/404",
  ];

  const isLandingPage =
    location.pathname === "/landing" ||
    location.pathname.startsWith("/landing/");

  

  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col ">
      {showSidebar && <Header className="w-full" />}
      <div className="flex flex-1 ">
        {showSidebar && localStorage.getItem("token") && <Sidebar />}
        <main className={`flex-1 my-4 ${isLandingPage ? "p-0" : "p-2 md:p-4"}   `}>
          <AppRoutes />
        </main>
      </div>
      <ToastContainer options={options} stacked />
      {/* <div className="fixed bottom-0 w-full">
        <Footer />
      </div> */}

    </div>
    
  );
};

export default Layout;

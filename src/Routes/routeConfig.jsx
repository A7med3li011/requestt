import Home from "../pages/home/home.jsx";
import Otp from "../pages/auth/Otp/Otp.jsx";
import SignUp from "../pages/auth/SignUp/SignUp.jsx";
import Role from "../pages/auth/SignUp/Role.jsx";
import LoginByMail from "../pages/auth/LognIn/LoginByEmail.jsx";
import ForgotPassword from "../pages/auth/LognIn/ForgotPassword.jsx";
import ProjectDetails from "../pages/Projects/ProjectDetails/ProjectDetails.jsx";
import AddProject from "../pages/Projects/AddProject/AddProject.jsx";
import AddTask from "../pages/Tasks/AddTask/AddTask.jsx";
import TasksPerProject from "../pages/Tasks/TasksPerProject/TasksPerProject.jsx";
import CreateTag from "../pages/setting/Tags/CreateTag.jsx";
import TaskDetails from "../pages/Tasks/TaskDetails/TaskDetails.jsx";
import CreateCompany from "../pages/auth/company/createCompany.jsx";
import Profile from "../pages/setting/Profile/Profile.jsx";
import Setting from "../pages/setting/setting.jsx";
import ContactUs from "../pages/contactUs/ContactUs.jsx";
import ProjectHistory from "../pages/Projects/ProjectHistory/ProjectHistory.jsx";
import Team from "../pages/Team/Team.jsx";
import DriveFiles from "../pages/DriveFiles/DriveFiles.jsx";
import RequestForMaterial from "../pages/Requests/RequestForMaterial.jsx";
import FilesPerTag from "../pages/DriveFiles/FilesPerTag.jsx";
import Models from "../pages/Requests/Models/Models.jsx";
import RequestForDocumentSubmittal from "../pages/Requests/RequestForDocumentSubmittal.jsx";
import WorkRequest from "../pages/Requests/WorkRequest.jsx";
import RequestForInspection from "../pages/Requests/RequestForInspection.jsx";
import TableOfQuantities from "../pages/Requests/TableOfQuantities/TableOfQuantities.jsx";
import Inbox from "../pages/Inbox/Inbox.jsx";
import SeePlans from "../pages/Plans/SeePlans.jsx";
import PlansInfo from "../pages/Plans/PlansInfo.jsx";
import PlanDetails from "../pages/Plans/PlanDetails.jsx";
import Payments from "../pages/Payments/Payments.jsx";
import AllSubTasks from "../pages/Tasks/AllSub/AllSubTasks.jsx";
import PerformanceEvaluation from "../pages/setting/Profile/PerformanceEvaluation.jsx";
import ProjectTeam from "../pages/Projects/ProjectTeam/ProjectTeam.jsx";
import Notifications from "../pages/Notifications/Notifications.jsx";
import LoginByPhone from "../pages/auth/LognIn/LoginByPhone.jsx";
import Landing from "../pages/landing/landing.jsx";
import Invite from "../pages/Projects/AddProject/Invite.jsx";
import TaskHistory from "../pages/Tasks/TaskHistory/TaskHistory.jsx";
import ViewRequest from "../pages/Requests/ViewRequest.jsx";
import Invitation from "../pages/Projects/AddProject/Invitaion.jsx";
import ViewAllModels from "../pages/Requests/Models/ViewAllModels.jsx";
import Page404 from "../pages/404Page/page404.jsx";
import { Navigate } from "react-router-dom";
import PreventAction from "../Services/PreventAction.jsx";
import Support from "../pages/landing/Support.jsx";
import Review from "../Components/Reviewing/Review.jsx";

// Define public routes
export const publicRoutes = [
  { path: "/*", component: <Landing /> },
  { path: "/LogIn", component: <LoginByPhone /> },
  { path: "/LogIn/Mail", component: <LoginByMail /> },
  { path: "/forgotPassword", component: <ForgotPassword /> },
  { path: "/Otp", component: <Otp /> },
  { path: "/SignUp", component: <SignUp /> },
  { path: "/SignUp/ChooseRole", component: <Role /> },
  { path: "/SignUp/createCompany", component: <CreateCompany /> },
  { path: "/SeePlans", component: <SeePlans /> },
  {
    path: "*",
    component: <Navigate to="/404" replace />,
  },
  { path: "/404", component: <Page404 /> },
];

// Define protected routes
export const protectedRoutes = [
  { path: "/home", component: <Home /> },
  { path: "/Support", component: <Support /> },
  // { path: "/ContactUs", component: <ContactUs /> },
  { path: "/Settings/Profile", component: <Profile /> },
  { path: "/Settings", component: <Setting /> },
  { path: "/review", component: <Review /> },
  {
    path: "/ProjectDetails/:id",
    component: (
      <PreventAction>
        <ProjectDetails />
      </PreventAction>
    ),
  },
  { path: "/Projects", component: <ProjectHistory /> },
  {
    path: "/TaskDetails/:id",
    component: (
      <PreventAction>
        <TaskDetails />
      </PreventAction>
    ),
  },
  { path: "/TaskHistory/:id", component: <TaskHistory /> },
  {
    path: "/AddProject",
    component: (
      <PreventAction>
        <AddProject />
      </PreventAction>
    ),
  },
  { path: "/AddProject/Invite", component: <Invite /> },
  { path: "/Invitation", component: <Invitation /> },
  {
    path: "/AddTask/:ProjectId",
    component: (
      <PreventAction>
        {" "}
        <AddTask />{" "}
      </PreventAction>
    ),
  },
  {
    path: "/Project/Tasks/:id",
    component: (
      <PreventAction>
        {" "}
        <TasksPerProject />{" "}
      </PreventAction>
    ),
  },
  { path: "/SubTasks/:id", component: <AllSubTasks /> },
  { path: "/createTag", component: <CreateTag /> },
  {
    path: "/Models",
    component: (
      <PreventAction>
        <Models />{" "}
      </PreventAction>
    ),
  },
  {
    path: "/ViewAllModels",
    component: (
      <PreventAction>
        {" "}
        <ViewAllModels />{" "}
      </PreventAction>
    ),
  },
  {
    path: "/viewModel/:id",
    component: (
      <PreventAction>
        {" "}
        <ViewRequest />{" "}
      </PreventAction>
    ),
  },
  {
    path: "/DriveFiles",
    component: (
      <PreventAction>
        <DriveFiles />
      </PreventAction>
    ),
  },
  { path: "/DriveFiles/Tag/:TagName", component: <FilesPerTag /> },
  {
    path: "/Inbox",
    component: (
      <PreventAction>
        {" "}
        <Inbox />{" "}
      </PreventAction>
    ),
  },
  { path: "/Requests/RequestForMaterial", component: <RequestForMaterial /> },
  {
    path: "/Requests/RequestForDocumentSubmittal",
    component: <RequestForDocumentSubmittal />,
  },
  { path: "/Requests/WorkRequest", component: <WorkRequest /> },
  {
    path: "/Requests/RequestForInspection",
    component: <RequestForInspection />,
  },
  { path: "/Requests/TableOfQuantities", component: <TableOfQuantities /> },

  {
    path: "/Team",
    component: (
      <PreventAction>
        {" "}
        <Team />{" "}
      </PreventAction>
    ),
  },

  { path: "/PlansInfo", component: <PlansInfo /> },
  { path: "/PlanDetails/:type", component: <PlanDetails /> },
  { path: "/Payments", component: <Payments /> },
  { path: "/PerformanceEvaluation", component: <PerformanceEvaluation /> },
  { path: "/ProjectTeam", component: <ProjectTeam /> },
  { path: "/Notifications", component: <Notifications /> },
  { path: "/404", component: <Page404 /> },
  {
    path: "*",
    component: <Navigate to="/404" replace />,
  },
];

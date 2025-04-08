import { MdDelete } from "react-icons/md";
import {
  delegatedTeam,
  deleteUserFromProject,
  deleteUserFromUsers,
} from "../../../Services/api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../../../Components/Loader/Loader";
import ProfileAvatar from "../../../Components/UI/profilePic/profilePic";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import { t } from "i18next";
import i18next from "i18next";

const DelegatedAccess = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [Team, setTeam] = useState([]);
  const [open, setOpen] = useState(false);
  const [openAcc, setOpenAcc] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const lang = i18next.language;
  const handleOpen = () => setOpen(!open);
  const handleOpenAccordion = (projectId) => {
    setOpenAcc((prevOpen) => (prevOpen === projectId ? null : projectId));
  };

 
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await delegatedTeam(token, user.team);
        setTeam(data.results);
        data;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, user.team]);


  const handleDelete = async () => {
    if (selectedUserId && selectedProjectId) {
      setLoading(true);
      try {
        const res = await deleteUserFromProject(
          token,
          selectedProjectId,
          selectedUserId
        );
        "res : ", res;

        setTeam((prevTeam) =>
          prevTeam.map((project) => {
            if (project.projectId === selectedProjectId) {
              return {
                ...project,
                members: project.members.filter(
                  (member) => member.id !== selectedUserId
                ),
              };
            }
            return project;
          })
        );

        toast.success(t("toast.userDeletedSuccessfully"));
        window.location.reload();
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    handleOpen();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }
  // console.log(selectedProjectId);
  return (
    <>
      <div className="DelegatedAccess bg-white rounded-3xl m-2 p-4 relative overflow-x-auto hidden lg:block">
        <table className="w-full text-sm text-center text-gray-500 border-collapse ">
          <thead className="text-xs font-bold text-gray-dark uppercase border-b-2 border-gray">
            <tr>
              <th className="px-4 py-2">{t("Name")}</th>
              <th className="px-4 py-2">{t("Vocation")}</th>
              <th className="px-4 py-2">{t("Email")}</th>
              <th className="px-4 py-2">{t("Phone number")}</th>
              <th className="px-4 py-2">{t("Access")}</th>
              <th className="px-4 py-2">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {Team.map((project) => (
              <>
                <tr key={project.projectId}>
                  <td
                    colSpan="6"
                    className="text-left py-3 px-4  font-medium text-gray-dark"
                  >
                    {project.projectName}
                  </td>
                </tr>

                {project.members.map((member) => (
                  <tr
                    key={member._id}
                    className="bg-white shadow-lg rounded-3xl my-1 border-b last:border-none"
                  >
                    <td className="px-4 py-2 flex items-center gap-3">
                      <ProfileAvatar
                        name={member.name}
                        profilePic={member.profilePic}
                      />
                      <span>{member.name}</span>
                    </td>
                    <td className="px-4 py-2">
                      {member.vocation ? member.vocation.name : "N/A"}
                    </td>
                    <td
                      className="px-4 py-2 "
                      style={{
                        color: "#5BA6FF",
                      }}
                    >
                      {member.email}
                    </td>
                    <td
                      className="px-4 py-2 text-green"
                      style={{
                        color: "#34C759",
                      }}
                    >
                      {member.phone}
                    </td>
                    <td className="px-4 py-2">{member.access}</td>
                    <td className="px-4 py-2 flex justify-center gap-3">
                      <button
                        className="text-red"
                        onClick={() => {
                          setSelectedUserId(member._id);
                          setSelectedProjectId(project.projectId);

                          handleOpen();
                        }}
                      >
                        <MdDelete className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
        <div className="delete">
          <Dialog open={open} handler={handleOpen}>
            <DialogHeader>
              <Typography variant="h5" color="blue-gray">
                Your Attention is Required!
              </Typography>
            </DialogHeader>
            <DialogBody divider className="grid place-items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-16 w-16 text-red-500"
              >
                <path
                  fillRule="evenodd"
                  d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.297-1.206A6.75 6.75 0 015.25 9V9zM7.5 9a4.5 4.5 0 019 0v.75a6.75 6.75 0 01-1.5 4.5v-.001A2.25 2.25 0 018.25 14a2.25 2.25 0 01-2.25-2.25V9z"
                  clipRule="evenodd"
                />
              </svg>
              <Typography variant="h6" className="text-center text-lg">
                Are you sure you want to delete this user?
              </Typography>
            </DialogBody>
            <DialogFooter>
              <Button variant="text" color="red" onClick={handleOpen}>
                Cancel
              </Button>
              <Button
                variant="gradient"
                onClick={() => {
                  handleDelete();
                  
                }}
              >
                Yes, delete
              </Button>
            </DialogFooter>
          </Dialog>
        </div>

        {/*  mobile view  */}
      </div>
      <div className="block lg:hidden">
        {Team.map((project) => (
          <Accordion
            key={project.projectId}
            open={openAcc === project.projectId}
          >
            <AccordionHeader
              className=" p-3 rounded-3xl text-gray my-2 shadow-md bg-white"
              onClick={() => handleOpenAccordion(project.projectId)}
            >
              <h5>{project.projectName}</h5>
            </AccordionHeader>
            <AccordionBody open={openAcc === project.projectId}>
              {project.members.map((member) => (
                <div
                  key={member._id}
                  className="flex flex-col  relative  rounded-xl shadow-md p-4 my-2 bg-white"
                >
                  <div className="absolute top-4 rtl:left-4 ltr:right-4 flex gap-2">
                    <button
                      className="text-red"
                      onClick={() => {
                        setSelectedUserId(member._id);
                        setSelectedProjectId(project.projectId);

                        handleOpen();
                      }}
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    <ProfileAvatar
                      name={member.name}
                      profilePic={member.profilePic}
                    />

                    <span className="tet-base font-medium">{member.name}</span>
                    <span className="tet-base font-medium">
                      {member.vocation ? member.vocation.name : "N/A"}
                    </span>
                    <span
                      className="tet-base font-medium"
                      style={{
                        color: "#5BA6FF",
                      }}
                    >
                      {member.email}
                    </span>
                    <span
                      className="tet-base font-medium"
                      style={{
                        color: "#34C759",
                      }}
                    >
                      {member.phone}
                    </span>
                    <span>{member.access}</span>
                  </div>{" "}
                </div>
              ))}
            </AccordionBody>
          </Accordion>
        ))}
      </div>
    </>
  );
};

export default DelegatedAccess;

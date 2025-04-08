import { useEffect, useState } from "react";
import { BsEye, BsEyeSlash, BsMicrosoftTeams } from "react-icons/bs";
import {
  addMemberForProject,
  deleteMemberFromProjectTeam,
  getAllMembersByProject,
  getAllTagsByUser,
  getAllVocations,
  getMembersByProject,
} from "../../../Services/api";
import { Link, useLocation } from "react-router-dom";
import ProfileAvatar from "../../../Components/UI/profilePic/profilePic";
import { useCountries } from "use-react-countries";
import { useSelector } from "react-redux";
import Loader from "../../../Components/Loader/Loader";
import { MdDelete, MdOutlinePerson } from "react-icons/md";
import { CiMail } from "react-icons/ci";
import {
  Input as MaterialInput,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Button as Btn,
  Dialog,
  DialogHeader,
  Typography,
  DialogBody,
  DialogFooter,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import Select, { components } from "react-select";
import Button from "../../../Components/UI/Button/Button";
import { t } from "i18next";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import i18next from "i18next";

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "white",
    border: "1px solid var(--gray)",
    borderRadius: "15px",
    padding: "5px",
    minHeight: "42px",
    boxShadow: "none",
    "&:hover": { borderColor: "var(--gray)", value: false },
  }),
  placeholder: (provided) => ({ ...provided, color: "#999" }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "var(--gray)",
    "&:hover": { color: "var(--gray)", value: false },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: "white",
    color: "var(--gray)",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "var(--purple)",
      color: "white",
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "10px",
    marginTop: "4px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "var(--purple)",
    borderRadius: "12px",
    padding: "3px 6px",
  }),
  multiValueLabel: (provided) => ({ ...provided, color: "white" }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "white",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "var(--purple)",
      color: "var(--red)",
    },
  }),
};
const getErrorClass = (hasError) =>
  hasError ? "border border-red border-solid" : "";
// Reusable input component
export function Input({
  type,
  onChange,
  label,
  placeholder,
  required,
  pattern,
  icon,
  className,
  isPassword,
  togglePasswordVisibility,
  autoComplete,
  hasError,
  value,
}) {
  return (
    <div className="flex flex-col relative">
      <label className="font-medium text-sm text-start text-black">
        {label}
      </label>
      <input
        type={type}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        pattern={pattern}
        required={required}
        className={`rounded-lg input relative px-3 py-2 border-gray border placeholder:font-medium placeholder:text-base placeholder:text-gray focus:bg-white ${getErrorClass(
          hasError
        )} ${className}`}
      />
      <span className="absolute ltr:right-2 rtl:left-2 top-8 w-4 h-4 text-gray">
        {icon}
      </span>
      {isPassword && (
        <span
          className="absolute ltr:right-2 rtl:left-2 top-7 w-4 h-4 text-gray cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {type === "password" ? <BsEyeSlash /> : <BsEye />}
        </span>
      )}
    </div>
  );
}

const AnimatedMultiValue = (props) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.8, opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    <components.MultiValue {...props} />
  </motion.div>
);

const ProjectTeam = () => {
    const lang = i18next.language;
  const user = useSelector((state) => state.auth.user);
  const [membersData, setMembersData] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();
  const { projectId } = location.state || {};
  const countries = useCountries().countries;
  const [countryIndex, setCountryIndex] = useState(230);
  const { name, flags, countryCallingCode } = countries[countryIndex];
  const [loading, setLoading] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // const [projects, setProjects] = useState([]);
  const [vocations, setVocations] = useState([]);
  const [VocationLoading, setVocationLoading] = useState(true);
  // const [selectedProject, setSelectedProject] = useState(null);
  const [selectedVocation, setSelectedVocation] = useState([]);
  // const [selectedAccess, setSelectedAccess] = useState([]);
  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [Phone, setPhone] = useState("");
  const [Tags, setTags] = useState([]);
  const [SelectedTags, setSelectedTags] = useState([]);
  // const [isSelectOpen, setIsSelectOpen] = useState(true);
  const [TagsLoading, setTagsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openAcc, setOpenAcc] = useState(false);
  const [SelectedUserId, setSelectedUserId] = useState("");
  // const [SelectedProjectId, setSelectedProjectId] = useState();
  const [fieldErrors, setFieldErrors] = useState({
    Name: false,
    Email: false,
    Password: false,
    Phone: false,
    vocation: false,
    project: false,
    access: false,
    Tag: false,
  });
  const [accessList, setAccessList] = useState({
    delete: false,
    create: false,
    edit: false,
    read: false,
  });
  const handleOpen = () => setOpen(!open);
  // const handleOpenAccordion = () => setOpenAcc(!openAcc);
  const handleOpenAccordion = (idx) => {
    setOpenAcc((prevOpen) => (prevOpen === idx ? null : idx));
  };
  useEffect(() => {
    ("Current access list:", accessList);
  }, [accessList]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [
          vocationResponse,
          //  projectsResponse,
          TagsRes,
          MembersRes,
        ] = await Promise.all([
          getAllVocations(user._id, lang),
          // getAllProjectsForUser(user._id, token),
          getAllTagsByUser(user._id),
          getAllMembersByProject(projectId, lang),
        ]);

        setVocations(vocationResponse.results);
        setVocationLoading(false);

        // setProjects(projectsResponse.results);
        setTags(
          TagsRes.results.map((tag) => ({
            value: tag._id,
            label: tag.name,
            colorCode: tag.colorCode,
          }))
        );
        setTagsLoading(false);

        setMembersData(MembersRes);
        (membersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user._id, token]);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Remove non-digit characters
    const numericValue = value.replace(/\D/g, "");
    const codeWithoutPlus = countryCallingCode.replace("+", "");

    // Prevent user from starting the input with the country calling code
    if (value.startsWith(codeWithoutPlus)) {
      setFieldErrors({
        Phone: `Phone number cannot start with ${countryCallingCode}`,
      });
      return;
    }
    // Validate phone number length (9 or 11 digits)
    if (numericValue.length <= 11) {
      setPhone(numericValue);
    }

    // Display validation error if the number is invalid
    if (
      numericValue.length > 0 &&
      numericValue.length !== 9 &&
      numericValue.length !== 11
    ) {
      setFieldErrors("Phone number must be 9 or 11 digits long.");
    } else {
      setFieldErrors("");
    }
  };

  const clearFields = () => {
    setEmail("");
    setName("");
    setPassword("");
    setPhone("");
    setSelectedVocation([]);
    setSelectedTags([]);
    setAccessList({
      delete: false,
      create: false,
      edit: false,
      read: false,
    });

    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const newFieldErrors = {
      Name: !Name.trim(),
      Email: !Email.trim(),
      Password: !Password.trim(),
      Phone: !Phone.trim(),
      Access: !accessList,
      // Projects: !selectedProject,
      Vocations: !selectedVocation,
      Tags: !SelectedTags,
    };

    setFieldErrors(newFieldErrors);

    if (Object.values(newFieldErrors).some((hasError) => hasError)) {
      setFieldErrors({ message: "All fields are required." });
      return;
    }
    const fullPhoneNum = `${countryCallingCode}${Phone}`;
    try {
      const payload = {
        name: Name,
        password: Password,
        email: Email,
        phone: fullPhoneNum,
        vocation: selectedVocation?.value,
        access: accessList,
        // projects: selectedProject.map((p) => p.value),
        role: user.role._id,
        tags: SelectedTags.map((t) => t.value),
      };
      (payload);

      await addMemberForProject(projectId, payload, token);
      clearFields();
      toast.success(t("toast.MemberAdded"));
      window.location.reload();
    } catch (error) {
      (error);
      setFieldErrors(error);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const Member = {
        members: SelectedUserId,
      };
      const res = await deleteMemberFromProjectTeam(projectId, Member);
      ("log from project team ", projectId, "/", Member);

      ("res : ", res);

      toast.success(t("toast.userDeletedSuccessfully"));
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    } finally {
      setLoading(false);
    }

    handleOpen();
  };
  //  const handleChange = (selected) => {
  //    setSelectedAccess({
  //      optionSelected: selected,
  //    });
  //  };

  const changeDeleteValue = (value) => {
    setAccessList((prev) => ({
      ...prev,
      delete: value,
    }));
  };

  // Handler to change create permission
  const changeCreateValue = (value) => {
    setAccessList((prev) => ({
      ...prev,
      create: value,
    }));
  };

  // Handler to change edit permission
  const changeEditValue = (value) => {
    setAccessList((prev) => ({
      ...prev,
      edit: value,
    }));
  };

  // Handler to change read permission
  const changeReadValue = (value) => {
    setAccessList((prev) => ({
      ...prev,
      read: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (loading) return <p>Loading...</p>;

  const {
    admins = {},
    groupedMembers = [],
    ownerTeam = [],
    consultantTeam = [],
    constractorTeam = [],
    count = 0,
  } = membersData || {};
  const { owner, consultant, contractor } = admins;

  return (
    <div className="ProjectTeam">
      <div className="header bg-white rounded-3xl p-2">
        <div className="head flex items-center justify-between p-2">
          <h5 className="font-semibold text-base">{t("Team")}</h5>
          <div className="TotalMembers flex items-center gap-2">
            <span
              className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full"
              style={{ background: "#CCABDA" }}
            >
              <BsMicrosoftTeams className="text-purple-dark" />
            </span>
            <p
              className="font-medium md:font-semibold text-base md:text-lg"
              style={{ color: "#696A6B" }}
            >
              {t("Total Team Members")}
            </p>
            <span className="font-medium text-base">{count}</span>
          </div>
        </div>
      </div>

      <div className="admins grid grid-cols-1 lg:grid-cols-3 gap-3 my-3">
        {(owner || owner !== null) && (
          <div className="admin">
            <h4 className="m-1 font-medium text-sm">{t("owner")}</h4>
            <div className=" bg-white  flex items-center  gap-2 p-3 rounded-3xl">
              <ProfileAvatar
                name={owner?.name}
                profilePic={owner?.profilePic}
              />
              <div className="flex flex-col">
                <p className=" text-sm font-medium">
                  {owner?.name}{" "}
                  <span className="text-gray">(project manager)</span>
                </p>
                <span className="text-blue text-sm font-medium">
                  {t("ownerTeam")}
                </span>
              </div>
            </div>
          </div>
        )}
        {(consultant || consultant !== null) && (
          <div className="consultant">
            <h4 className="m-1 font-medium text-sm">{t("consultant")} </h4>
            <div className=" bg-white  flex items-center  gap-2 p-3 rounded-3xl">
              <ProfileAvatar
                name={consultant?.name}
                profilePic={consultant?.profilePic}
              />
              <div className="flex flex-col">
                <p className=" text-sm font-medium">
                  {consultant?.name}{" "}
                  <span className="text-gray">(Consulting Manager)</span>
                </p>
                <span className="text-blue text-sm font-medium">
                  {t("consultantTeam")}
                </span>
              </div>
            </div>
          </div>
        )}
        {(contractor || contractor !== null) && (
          <div className="contractor">
            <h4 className="m-1 font-medium text-sm">{t("contractor")}</h4>
            <div className=" bg-white  flex items-center  gap-2 p-3 rounded-3xl">
              <ProfileAvatar
                name={contractor?.name}
                profilePic={contractor?.profilePic}
              />
              <div className="flex flex-col">
                <p className=" text-sm font-medium">
                  {contractor?.name}{" "}
                  <span className="text-gray">(Contracting Manager)</span>
                </p>
                <span className="text-blue text-sm font-medium">
                  {t("contractorTeam")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="DelegatedAccess bg-white rounded-3xl m-2 p-4 hidden lg:block">
        <table className="w-full text-sm text-center text-gray-500 border-collapse">
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
            {ownerTeam.length > 0 && (
              <h4 className="text-blue my-1"> {t("ownerTeam")}</h4>
            )}

            {ownerTeam.map((member) => (
              <>
                <tr key={member._id} className="shadow-md p-2 rounded-lg">
                  <td className="text-left py-2 px-4 font-medium text-gray-dark">
                    {member.name}
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
                        handleOpen();
                      }}
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              </>
            ))}
            {consultantTeam.length > 0 && (
              <h4 className="text-blue my-1">{t("consultantTeam")}</h4>
            )}
            {consultantTeam.map((member) => (
              <>
                <tr key={member._id} className="shadow-md p-2 rounded-lg">
                  <td className="text-left py-2 px-4 font-medium text-gray-dark">
                    {member.name}
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
                        handleOpen();
                      }}
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              </>
            ))}
            {constractorTeam.length > 0 && (
              <h4 className="text-blue my-1">{t("contractorTeam")}</h4>
            )}
            {constractorTeam.map((member) => (
              <>
                <tr key={member._id} className="shadow-md p-2 rounded-lg">
                  <td className="text-left py-2 px-4 font-medium text-gray-dark">
                    {member.name}
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
                        handleOpen();
                      }}
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              </>
            ))}

            {ownerTeam.length === 0 &&
              constractorTeam.length === 0 &&
              consultantTeam.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-4 text-gray-400">
                    {t("No Team Members")}
                  </td>
                </tr>
              )}
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
              <Btn variant="text" color="red" onClick={handleOpen}>
                Cancel
              </Btn>
              <Btn variant="gradient" onClick={handleDelete}>
                Yes, delete
              </Btn>
            </DialogFooter>
          </Dialog>
        </div>
      </div>

      {/* DelegatedAccess mobile view */}
      {/* <div className="DelegatedAccess block lg:hidden">
        <Accordion key={idx} open={openAcc === idx}>
          <AccordionHeader
            className="p-3 rounded-3xl text-gray my-2 shadow-md bg-white"
            onClick={() => handleOpenAccordion(idx)}
          >
            <h4 className="text-blue my-1"> {t("ownerTeam")}</h4>
          </AccordionHeader>
          <AccordionBody open={openAcc === idx}>
            {ownerTeam.map((member) => (
              <div
                key={member._id}
                className="flex flex-col relative rounded-xl shadow-md p-4 my-2 bg-white"
              >
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    className="text-red"
                    onClick={() => {
                      setSelectedUserId(member._id);
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
                  <span className="text-base font-medium">{member.name}</span>
                  <span className="text-base font-medium">
                    {member.vocation ? member.vocation.name : "N/A"}
                  </span>
                  <span
                    className="text-base font-medium"
                    style={{
                      color: "#5BA6FF",
                    }}
                  >
                    {member.email}
                  </span>
                  <span
                    className="text-base font-medium"
                    style={{
                      color: "#34C759",
                    }}
                  >
                    {member.phone}
                  </span>
                  <span>{member.access}</span>
                </div>
              </div>
            ))}
          </AccordionBody>
        </Accordion>
      </div> */}

      <div className="AddNewAccess bg-white rounded-3xl m-2 p-4">
        <form
          onSubmit={handleSubmit}
          className="form grid grid-cols-4 gap-2 max-w-5xl"
        >
          <div className="col-span-4 lg:col-span-2">
            <Input
              type={"email"}
              name="email"
              label={t("Email")}
              placeholder={t("Email")}
              autoComplete={"email"}
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              onChange={(e) => setEmail(e.target.value)}
              value={Email}
              hasError={fieldErrors.Email}
              icon={<CiMail />}
            />
          </div>
          <div className="col-span-4 lg:col-span-2">
            <Input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              label={t("Password")}
              placeholder={t("Password")}
              autoComplete={"new-password"}
              onChange={(e) => setPassword(e.target.value)}
              required
              value={Password}
              isPassword
              togglePasswordVisibility={togglePasswordVisibility}
            />
          </div>
          <div className="col-span-4 lg:col-span-2 ">
            <Input
              type="text"
              name="name"
              onChange={(e) => setName(e.target.value)}
              label={t("Name")}
              value={Name}
              placeholder={t("Name")}
              required
              icon={<MdOutlinePerson />}
            />
          </div>
          <div className="col-span-4 lg:col-span-2 relative flex mt-5  w-full">
            <Menu placement="bottom-start">
              <MenuHandler>
                <Btn
                  ripple={false}
                  variant="text"
                  color="blue-gray"
                  className="flex h-10 items-center gap-2  ltr:rounded-r-none rtl:rounded-l-none border ltr:border-r-0 rtl:border-l-0 border-gray border-solid pl-3"
                >
                  <img
                    src={flags.svg}
                    alt={name}
                    className="h-4 w-4 rounded-full object-cover"
                  />
                  {countryCallingCode}
                </Btn>
              </MenuHandler>
              <MenuList className="max-h-[20rem] max-w-[18rem]">
                {countries.map(({ name, flags, countryCallingCode }, index) => {
                  return (
                    <MenuItem
                      key={name}
                      value={name}
                      className="flex items-center gap-2"
                      onClick={() => setCountryIndex(index)}
                    >
                      <img
                        src={flags.svg}
                        alt={name}
                        className="h-5 w-5 rounded-full object-cover"
                      />
                      {name}{" "}
                      <span className="ml-auto">{countryCallingCode}</span>
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Menu>
            <MaterialInput
              type="tel"
              value={Phone}
              onChange={handlePhoneChange}
              placeholder="Mobile Number"
              className="ltr:rounded-l-none rtl:rounded-r-none border border-solid !border-gray focus:!border-gray"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              containerProps={{
                className: "min-w-0",
              }}
            />
          </div>
          <div className="col-span-4">
            <label
              className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2 cursor-pointer"
              htmlFor="vocation"
            >
              {t("Vocation")}
            </label>
            <Select
              placeholder={t("Select Vocation")}
              id="vocation"
              isClearable
              isLoading={loading}
              options={vocations.map((v) => ({ value: v._id, label: v.name }))}
              onChange={setSelectedVocation}
              value={selectedVocation}
              styles={customStyles}
              components={{ MultiValue: AnimatedMultiValue }}
            />
          </div>

          <div className="col-span-4">
            <label
              className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2 cursor-pointer"
              htmlFor="access"
            >
              {t("Tags")}
            </label>
            <Select
              placeholder={t("Select Tag")}
              id="Tags"
              isClearable
              isLoading={TagsLoading}
              value={SelectedTags}
              options={Tags}
              onChange={setSelectedTags}
              styles={customStyles}
              isMulti
            />
          </div>

          <div className="col-span-4 flex items-center gap-5">
            <label
              className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2 cursor-pointer"
              htmlFor="access"
            >
              {t("Access")}
            </label>

            <div className="read flex items-center gap-1 ">
              <input
                type="checkbox"
                id="read"
                checked={accessList.read}
                onChange={(e) => changeReadValue(e.target.checked)}
                className="appearance-none w-3 h-3  lg:w-4 lg:h-4 border border-gray rounded-sm cursor-pointer checked:bg-purple checked:border-purple duration-500"
              />
              <label htmlFor="read" className="font-medium text-base">
                {t("Read")}
              </label>
            </div>
            <div className="Edit flex items-center gap-1">
              <input
                type="checkbox"
                id="Edit"
                checked={accessList.edit}
                onChange={(e) => changeEditValue(e.target.checked)}
                className="appearance-none w-3 h-3  lg:w-4 lg:h-4 border border-gray rounded-sm cursor-pointer checked:bg-purple checked:border-purple duration-500"
              />
              <label htmlFor="write" className="font-medium text-base">
                {t("Edit")}
              </label>
            </div>
            <div className="create flex items-center gap-1">
              <input
                type="checkbox"
                id="create"
                checked={accessList.create}
                onChange={(e) => changeCreateValue(e.target.checked)}
                className="appearance-none w-3 h-3  lg:w-4 lg:h-4 border border-gray rounded-sm cursor-pointer checked:bg-purple checked:border-purple duration-500"
              />
              <label htmlFor="create" className="font-medium text-base">
                {t("Create")}
              </label>
            </div>
            <div className="delete flex items-center gap-1">
              <input
                type="checkbox"
                id="delete"
                checked={accessList.delete}
                onChange={(e) => changeDeleteValue(e.target.checked)}
                className="appearance-none w-3 h-3  lg:w-4 lg:h-4 border border-gray rounded-sm cursor-pointer checked:bg-purple checked:border-purple duration-500"
              />
              <label htmlFor="delete" className="font-medium text-base">
                {t("Delete")}
              </label>
            </div>
          </div>
          {/* <Link className="underline underline-offset-1 text-base text-cyan-500 mx-2">
            Advanced setting
          </Link> */}

          {fieldErrors && (
            <div className="flex justify-center  items-center">
              <span className="text-red font-bold text-center p-2">
                {t(fieldErrors.message)}
              </span>
            </div>
          )}
          <div className="btn flex items-center justify-center md:justify-end col-span-4 mt-5">
            <Button
              onClick={handleSubmit}
              className={"px-0  text-sm lg:text-base"}
            >
              {t("add")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectTeam;


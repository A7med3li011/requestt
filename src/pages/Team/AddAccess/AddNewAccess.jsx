import React, { useEffect, useState } from "react";
import { BsEye, BsEyeSlash, BsFillTelephoneFill } from "react-icons/bs";
import { MdOutlinePerson } from "react-icons/md";
import { IoBagHandleOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { t } from "i18next";
import {
  getAllProjectsForUser,
  getAllTagsByUser,
  getAllVocations,
  getUserGroup,
  updateTeam,
} from "../../../Services/api";
import { useSelector } from "react-redux";
import Select, { components, useStateManager } from "react-select";
import { color, motion } from "framer-motion";
import "../style.scss";
import Button from "../../../Components/UI/Button/Button";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useCountries } from "use-react-countries";
import {
  Input as MaterialInput,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button as Btn,
} from "@material-tailwind/react";
import Loader from "../../../Components/Loader/Loader";
import i18next from "i18next";
// Custom styles for react-select
const customStyles = {
  control: (provided) => ({
    ...provided,
    color: "red",
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
    color: "black",
    "&:hover": { color: "var(--gray)", value: false },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: "white",
    color: "black",
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

// const CustomOption = (props) => {
//   return (
//     <components.Option {...props}>
//       <input
//         type="checkbox"
//         checked={props.isSelected}
//         onChange={() => null}
//         style={{ marginRight: 10 }}
//         onClick={(e) => {
//           e.stopPropagation(); // Prevent closing the select menu
//           props.onRemove(props.data); // Remove option
//         }}
//         className="appearance-none w-3 h-3 border border-gray rounded-sm cursor-pointer checked:bg-purple checked:border-purple duration-500"
//       />
//       {props.label}
//     </components.Option>
//   );
// };

const getErrorClass = (hasError) =>
  hasError ? "border border-red border-solid" : "";
// Reusable input component
export function Input({
  type,
  onChange,
  label,
  placeholder,
  required,
  icon,
  className,
  isPassword,
  togglePasswordVisibility,
  autoComplete,
  hasError,
  value,
  min,
  max,
  pattern,
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
        minLength={min}
        maxLength={max}
        required={required}
        pattern={pattern}
        className={`rounded-lg input relative px-3 py-2 border-gray border placeholder:font-medium placeholder:text-base placeholder:text-gray-400 focus:bg-white ${getErrorClass(
          hasError
        )} ${className}`}
      />
      <span className="absolute ltr:right-2 rtl:left-2 top-8 w-6 h-6 text-gray-400">
        {icon}
      </span>
      {isPassword && (
        <span
          className="absolute ltr:right-2 rtl:left-2 top-7 w-6 h-6 text-gray cursor-pointer"
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

const AddNewAccess = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const countries = useCountries().countries;
  const [phoneError, setPhoneError] = useState(false);
  const [accessError, SetAccessError] = useState(false);
  const [NameError, setNameError] = useState(false);
  const [countryIndex, setCountryIndex] = useState(230);
  const { name, flags, countryCallingCode } = countries[countryIndex];
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [vocations, setVocations] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedVocation, setSelectedVocation] = useState([]);
  // const [selectedAccess, setSelectedAccess] = useState([]);
  const [accessList, setAccessList] = useState({
    delete: false,
    create: false,
    edit: false,
    read: false,
  });
  const [loading, setLoading] = useState(true);
  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [Phone, setPhone] = useState("");
  const [Tags, setTags] = useState([]);
  const [SelectedTags, setSelectedTags] = useState([]);
  const [isSelectOpen, setIsSelectOpen] = useState(true);
  const [TagsLoading, setTagsLoading] = useState(true);
  const [VocationLoading, setVocationLoading] = useState(true);

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
  const lang = i18next.language;

  console.log(lang);
  useEffect(() => {
    "Current access list:", accessList;
  }, [accessList]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [vocationResponse, projectsResponse, TagsRes] = await Promise.all(
          [
            getAllVocations(user._id, lang),
            getAllProjectsForUser(user._id, token),
            getAllTagsByUser(user._id),
          ]
        );

        setVocations(vocationResponse.allVocations);
        setVocationLoading(false);

        setProjects(projectsResponse.results);
        setTags(
          TagsRes.results.map((tag) => ({
            value: tag._id,
            label: tag.name,
            colorCode: tag.colorCode,
          }))
        );
        setTagsLoading(false);
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
    setSelectedProject(null);
    setSelectedVocation([]);
    setSelectedTags([]);
    setAccessList({
      delete: false,
      create: false,
      edit: false,
      read: false,
    });
    // setSelectedAccess([]);
    setFieldErrors({});
  };

  useEffect(() => {
    setPhoneError(false);
  }, [Phone]);
  useEffect(() => {
    setNameError(false);
  }, [Name]);
  // useEffect(() => {
  //   SetAccessError(false);
  // }, [accessList12w]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const newFieldErrors = {
      Name: !Name.trim(),
      Email: !Email.trim(),
      Password: !Password.trim(),
      Phone: !Phone.trim(),
      Access: !accessList,
      Projects: !selectedProject,
      Vocations: !selectedVocation,
      Tags: !SelectedTags,
    };

    setFieldErrors(newFieldErrors);

    if (Object.values(newFieldErrors).some((hasError) => hasError)) {
      setFieldErrors({ message: "All fields are required." });
      return;
    }
    const fullPhoneNum = `${countryCallingCode}${Phone}`;

    if (fullPhoneNum.length < 11) {
      setPhoneError(true);
      console.log("in valid phone number", fullPhoneNum);
      return;
    }
    if (Name.length < 3) {
      setNameError(true);
      console.log("in valid phone number", fullPhoneNum);
      return;
    }

    if (Object.values(accessList).every((value) => value === false)) {
      SetAccessError(true);
      return;
    }
    try {
      const payload = {
        name: Name,
        password: Password,
        email: Email,
        phone: fullPhoneNum,
        vocation: selectedVocation?.value,
        access: accessList,
        projects: selectedProject.map((p) => p.value),
        role: user.role._id,
        tags: SelectedTags.map((t) => t.value),
      };
      payload;

      await updateTeam(token, user.team, payload, lang);
      clearFields();
      toast.success(t("toast.MemberAdded"));
    } catch (error) {
      error;
      setFieldErrors(error);
    }
  };

  const accessOptions = [
    { id: "read", label: "READ", value: false },
    { id: "write", label: "WRITE", value: false },
    { id: "create", label: "CREATE", value: false },
    { id: "delete", label: "DELETE", value: false },
  ];

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
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

  console.log(vocations);

  return (
    <div className="AddNewAccess bg-white rounded-3xl m-2 p-4">
      <form
        onSubmit={handleSubmit}
        className="form grid grid-cols-4 gap-2 max-w-5xl"
      >
        <div className="col-span-4 md:col-span-2  ">
          <Input
            type={"email"}
            name="email"
            label={t("Email")}
            placeholder={t("Email")}
            autoComplete={"email"}
            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            onChange={(e) => setEmail(e.target.value)}
            value={Email}
            hasError={fieldErrors.Email}
            icon={<CiMail />}
          />
        </div>

        <div className="col-span-4 md:col-span-2">
          <Input
            type={isPasswordVisible ? "text" : "password"}
            name="password"
            label={t("Password")}
            placeholder={t("Password")}
            autoComplete={"new-password"}
            onChange={(e) => setPassword(e.target.value)}
            required
            value={Password}
            min={8}
            isPassword
            togglePasswordVisibility={togglePasswordVisibility}
          />
        </div>

        <div className="col-span-4 md:col-span-2 ">
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

        <div className="col-span-4 md:col-span-2  focus:border-2  focus:border-rose-500 relative flex mt-5  w-full ">
          <Menu placement="bottom-start">
            <MenuHandler>
              <Btn
                ripple={false}
                variant="text"
                color="blue-gray"
                className="flex h-10 items-center gap-2  ltr:rounded-r-none rtl:rounded-l-none border ltr:border-r-0 rtl:border-l-0 border-[#EeEE] focus:border-black focus:border-2 border-solid pl-3"
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
                    className="flex items-center gap-2 "
                    onClick={() => setCountryIndex(index)}
                  >
                    <img
                      src={flags.svg}
                      alt={name}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                    {name} <span className="ml-auto">{countryCallingCode}</span>
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
          {/* <MaterialInput
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
          /> */}
          <input
            dir={lang == "en" ? "ltr" : "rtl"}
            type="tel"
            min={11}
            minLength={11}
            maxLength={15}
            // country={country.value}
            placeholder={t("Phone number")}
            value={Phone}
            onChange={handlePhoneChange}
            className={` mb-[1.5px] border-[1px]  w-full focus:outline-none  px-2 ${
              lang == "en"
                ? "rounded-l-none rounded-lg"
                : "rounded-r-none rounded-lg"
            }  `}
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
            isLoading={VocationLoading}
            options={vocations?.map((v) => ({
              value: v._id,
              label: lang == "en" ? v.nameEN : v.nameAR,
            }))}
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
        <div className="col-span-4">
          <label
            className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2 cursor-pointer"
            htmlFor="projects"
          >
            {t("Projects")}
          </label>
          <Select
            placeholder={t("Select Project")}
            id="projects"
            isMulti
            isClearable
            isLoading={loading}
            options={projects.map((p) => ({ value: p._id, label: p.name }))}
            onChange={setSelectedProject}
            value={selectedProject}
            styles={customStyles}
            components={{ MultiValue: AnimatedMultiValue }}
          />
        </div>
        <div className="col-span-4 flex items-center gap-5">
          <label
            className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2 cursor-pointer"
            htmlFor="access"
          >
            {t("Access")}
          </label>
          {/* 
          <Select
            options={accessOptions.map((option) => ({
              value: option.id,
              label: option.label,
            }))}
            value={setSelectedAccess.optionSelected}
            isMulti
            onChange={handleChange}
            components={{ Option: CustomOption }}
            styles={customStyles}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            classNamePrefix="select"
          /> */}
          <div className="read flex items-center gap-1 ">
            <input
              type="checkbox"
              id="read"
              checked={accessList.read}
              onChange={(e) => changeReadValue(e.target.checked)}
              className="appearance-none w-3 h-3 border border-gray rounded-sm cursor-pointer checked:bg-purple checked:border-purple duration-500"
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
              className="appearance-none w-3 h-3 border border-gray rounded-sm cursor-pointer checked:bg-purple checked:border-purple duration-500"
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
              className="appearance-none w-3 h-3 border border-gray rounded-sm cursor-pointer checked:bg-purple checked:border-purple duration-500"
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
              className="appearance-none w-3 h-3 border border-gray rounded-sm cursor-pointer checked:bg-purple checked:border-purple duration-500"
            />
            <label htmlFor="delete" className="font-medium text-base">
              {t("Delete")}
            </label>
          </div>
        </div>
        {/* <Link className="underline underline-offset-1 text-base text-cyan-500 mx-2">
          {t("Advanced setting")}
        </Link> */}

        {fieldErrors && (
          <div className="text-red font-bold text-center p-2">
            {t(fieldErrors.message)}
          </div>
        )}
        {phoneError && (
          <div className="text-red font-bold text-center p-2">
            phone number is not valid
          </div>
        )}
        {NameError && (
          <div className="text-red font-bold text-center p-2">
            name must be at least 3 characters
          </div>
        )}
        {accessError && (
          <div className="text-red font-bold text-center p-2">
            You must select the member access type
          </div>
        )}
        <div className="btn flex items-center justify-center md:justify-between col-span-4 mt-5">
          <Button onClick={handleSubmit} className={"px-0 text-sm"}>
            {t("add")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddNewAccess;

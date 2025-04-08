import { useState, useImperativeHandle, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CiCamera } from "react-icons/ci";
import { t } from "i18next";
import { handleUpdateUser } from "../../../redux/services/authServices";
import UiInput from "../../../Components/UI/Input/UIInput";
import Datepicker from "react-tailwindcss-datepicker";
import Alert from "../../../Components/Alert/Alert";
import { TfiLock } from "react-icons/tfi";
import "./style.scss";
import { toast } from "react-toastify";
import defaultAvatar from "../../../assets/images/avatar1.png";
import Loader from "../../../Components/Loader/Loader";

const Profile = forwardRef(({ onProfileUpdate }, ref) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  console.log(user);

  const [dob, setDob] = useState(user.dateOfBirth);
  const [Name, setName] = useState(user.name);
  const [Email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user?.role?.jobTitle || "");
  const [tel, setTel] = useState(user.phone);
  const [profilePic, setProfilePic] = useState("");
  const [presentAddress, setPresentAddress] = useState(user.presentaddress);
  const [city, setCity] = useState(user.city);
  const [country, setCountry] = useState(user.country);
  const [preview, setPreview] = useState(user.profilePic);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Access the first file in the FileList
    if (file) {
      "Selected file:", file; // Debugging: Check if file is selected correctly
      setProfilePic(file); // Set the selected file
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Set the preview image
      };
      reader.readAsDataURL(file); // Read the file as a Data URL
    }
  };

  // Date formatting function
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  console.log(formatDate(dob.endDate));
  const handleUpdate = () => {
    if (isUpdating || loading) return;
    setLoading(true);

    setIsUpdating(true);
    const formattedDate = dob.endDate ? formatDate(dob.endDate) : "";

    const updatedUser = {
      name: Name,
      email: Email,
      phone: tel,
      presentaddress: presentAddress,
      city: city,
      country: country,
      dateOfBirth: dob,
    };

    const updateAction = profilePic
      ? handleUpdateUser({ updatedData: updatedUser, profilePic: profilePic })
      : handleUpdateUser({ updatedData: updatedUser });

    dispatch(updateAction)
      .then(() => {
        toast.success(t("toast.ProfileChangesSuccess"));
        setIsUpdating(false);
        setLoading(false);

        if (onProfileUpdate) {
          onProfileUpdate();
        }
      })
      .catch(() => {
        setIsUpdating(false);
        setLoading(false);
      });
  };

  // Expose the handleUpdate function
  useImperativeHandle(ref, () => ({
    handleUpdate,
  }));

  const nameParts = Name.split(" ");
  const firstNameInitial = nameParts[0] ? nameParts[0][0] : "";
  const lastNameInitial = nameParts[1] ? nameParts[1][0] : "";

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="Profile ">
      <div className="wrapper bg-white rounded-xl p-4 m-2">
        <div className="flex flex-col">
          <div className="avatar  my-2 col-span-2 relative ">
            {preview ? (
              <img
                src={`https://api.request-sa.com/${user.profilePic}`}
                alt="avatar"
                className="rounded-full  w-24 h-24 object-contain relative border border-solid  border-gray p-2"
              />
            ) : (
              <>
                <span className="user-profile-image w-24 h-24 text-3xl">
                  {firstNameInitial}
                  {lastNameInitial}
                </span>
              </>
            )}

            <button
              onClick={() => document.getElementById("fileInput").click()}
              className="absolute  h-10 rounded-b-full flex items-center justify-center ltr:left-0  rtl:right-0 bottom-px  cursor-pointer "
              style={{
                background: "#9E9E9E",
                width: "95px",
              }}
            >
              <CiCamera className="text-white w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <form
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full"
            onSubmit={handleUpdate}
          >
            <div className="flex flex-col my-2 col-span-2 ">
              <UiInput
                type="text"
                id="name"
                label={t("yourName")}
                value={Name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
              />
            </div>
            <div className="flex flex-col my-2 col-span-2 ">
              <UiInput
                type="email"
                id="email"
                value={Email}
                disabled
                label={t("Email")}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="flex flex-col my-2 col-span-2">
              <UiInput
                type="text"
                label={t("role")}
                id="clientType"
                value={role}
                disabled
                placeholder={role}
              />
            </div>
            <div className="flex flex-col my-2 col-span-2">
              <UiInput
                type={"tel"}
                id="phoneNumber"
                label={t("PhoneNumber")}
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                placeholder="+0753235789"
              />
            </div>
            <div className="flex flex-col my-2 col-span-2">
              <label
                htmlFor="dob"
                className="text-sm font-medium text-gray-700 flex justify-start"
              >
                {t("dob")}
              </label>
              <Datepicker
                useRange={false}
                asSingle={true}
                value={
                  dob
                    ? formatDate(dob.startDate)
                    : formatDate(user.dateOfBirth.startDate)
                }
                maxDate={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 18)
                  )
                } // Minimum date is 18 years ago
                placeholder={
                  dob
                    ? formatDate(dob.startDate)
                    : formatDate(user.dateOfBirth.startDate)
                }
                primaryColor={"purple"}
                popoverDirection="up"
                toggleClassName="text-yellow absolute top-3 ltr:right-4 rtl:left-4"
                inputClassName="Input_UI p-2 border border-gray-300 rounded-xl w-full placeholder-gray-500"
                onChange={(e) => setDob(e)}
              />
            </div>
            <div className="flex flex-col my-2 col-span-2 ">
              <UiInput
                type="text"
                id="address"
                label={t("Address")}
                value={presentAddress}
                onChange={(e) => setPresentAddress(e.target.value)}
                placeholder="San Jose, California, USA"
              />
            </div>
            <div className="flex flex-col my-2 col-span-2">
              <UiInput
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                label={t("City")}
                placeholder="City"
              />
            </div>
            <div className="flex flex-col my-2 col-span-2">
              <UiInput
                type="text"
                label={t("Country")}
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
              />
            </div>
            <Alert
              icon={<TfiLock className="w-5 h-5 text-gray-600" />}
              msg={t(
                "We keep your data private and never share it with third-parties."
              )}
              msg_class={"msg_profile"}
              icon_class={"icon_profile"}
              customClass={"alert_profile col-span-2"}
            />
          </form>
        </div>
        {/* <div className="btn flex items-center justify-center md:justify-end my-3">
          <Button onClick={handleUpdate}>{t("save")}</Button>
        </div> */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
          id="fileInput"
        />
      </div>
    </div>
  );
});

export default Profile;

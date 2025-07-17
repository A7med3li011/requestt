import { t } from "i18next";
import UiInput from "../../Components/UI/Input/UIInput";
import Button from "../../Components/UI/Button/Button";
import ContactUsImage from "../../assets/images/ContactUs.svg";
import { CiLocationOn, CiMail } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa6";
import { useState } from "react";
import { sendEmailGetInTouch } from "../../Services/api";
import { toast } from "react-toastify";
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
} from "@material-tailwind/react";
import { useCountries } from "use-react-countries";
import { useTranslation } from "react-i18next";
import { PhoneInput } from "react-international-phone";
import image2 from "../../assets/images/sign-no-tagline-transparent-1500x1500 (1).png";

const Support = () => {
  const [nameError, setNameError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [Name, setName] = useState("");
  const [Title, setTitle] = useState("");
  const [Email, setEmail] = useState("");
  const [Message, setMessage] = useState("");
  const [Phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const countries = useCountries().countries;
  const [countryIndex, setCountryIndex] = useState(230);
  const { name, flags, countryCallingCode } = countries[countryIndex];
  const [fieldErrors, setFieldErrors] = useState({
    Name: false,
    Title: false,
    Email: false,
    Phone: false,
    Message: false,
    image: false,
  });

  const { i18n } = useTranslation();

  const handlePhoneChange = (e) => {
    console.log(i18n.language);
    const value = e?.target?.value;
    // Remove non-digit characters
    const numericValue = value.replace(/\D/g, "");
    const codeWithoutPlus = countryCallingCode.replace("+", "");

    // Prevent user from starting the input with the country calling code
    if (value.startsWith(codeWithoutPlus)) {
      setError({
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
      setError("Phone number must be 9 or 11 digits long.");
    } else {
      setError("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Optional: Add file validation
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setImageError(true);
        setError("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
        return;
      }

      // Optional: Add file size validation (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setImageError(true);
        setError("Image file size must be less than 5MB");
        return;
      }

      setImage(file);
      setImageError(false);
      setError(""); // Clear any previous errors
    } else {
      setImage(null);
    }
  };

  const clearFields = () => {
    setName("");
    setTitle("");
    setEmail("");
    setMessage("");
    setPhone("");
    setImage(null);
    // Clear file input
    const fileInput = document.getElementById("image");
    if (fileInput) {
      fileInput.value = "";
    }
    setFieldErrors({
      Name: false,
      Title: false,
      Email: false,
      Phone: false,
      Message: false,
      image: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Name) {
      setNameError(true);
    }
    if (!Title) {
      setTitleError(true);
    }
    if (Phone.length < 11) {
      setPhoneError(true);
    }
    if (!Email) {
      setEmailError(true);
    }
    if (!Message) {
      setMessageError(true);
    }
    if (!image) {
      setImageError(true);
    }

    // Trim inputs
    const trimmedName = Name.trim();
    const trimmedTitle = Title.trim();
    const trimmedEmail = Email.trim();
    const trimmedPhone = Phone.trim();
    const trimmedMessage = Message.trim();

    // Check if the trimmed message is empty
    if (!trimmedMessage) {
      setError("Please enter a message.");
      return;
    }

    // Check if required fields are filled
    if (
      !trimmedName ||
      !trimmedTitle ||
      !trimmedEmail ||
      !trimmedPhone ||
      !image
    ) {
      setError("Please fill all fields and select an image.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      // Create FormData object
      const formData = new FormData();
      formData.append("name", trimmedName);
      formData.append("title", trimmedTitle);
      formData.append("email", trimmedEmail);
      formData.append("phone", trimmedPhone);
      formData.append("message", trimmedMessage);

      // Make sure the image is properly appended
      if (image instanceof File) {
        formData.append("image", image, image.name);
      }

      // Debug: Log FormData contents
      console.log("FormData contents:");
      console.log("Image file:", image);
      console.log("Image file type:", image?.type);
      console.log("Image file size:", image?.size);
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Send FormData to API
      const res = await sendEmailGetInTouch(formData);

      toast.success(t("toast.MsgSentSuccess"));
      clearFields();
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className=" grid  grid-cols-2 lg:grid-cols-4  gap-4 p-8 pt-0  overflow-hidden relative">
      <div className="form col-span-2 p-3 ">
        <h2 className="text-purple-dark  text-2xl  font-bold my-1">
          {t("Get in touch")}
        </h2>
        <p className="text-lg font-normal text-gray-dark my-2">
          {t("We are here for you! How can we help?")}
        </p>
        <form
          action="submit"
          onSubmit={handleSubmit}
          className="form bg-white rounded-3xl  p-4  "
        >
          <div className="Name my-2 relative">
            {!Name && (
              <p
                className={`text-rose-600 absolute text-lg  ${
                  i18n.language == "en" ? "left-[-1%]" : "right-[-2%]"
                }`}
              >
                *
              </p>
            )}
            <UiInput
              type="text"
              onFocus={() => setNameError(false)}
              id="name"
              label={t("yourName")}
              value={Name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("yourName")}
              className={`border border-solid ${
                fieldErrors.Name ? "border-red" : "border-purple"
              } focus:border focus:border-solid focus:border-purple ${
                nameError ? "border-[1px] border-rose-500" : ""
              }`}
            />
          </div>

          <div className="Title my-2 relative">
            {!Title && (
              <p
                className={`text-rose-600 absolute text-lg  ${
                  i18n.language == "en" ? "left-[-1%]" : "right-[-2%]"
                }`}
              >
                *
              </p>
            )}
            <UiInput
              type="text"
              onFocus={() => setTitleError(false)}
              id="title"
              label={t("title")}
              value={Title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("title")}
              className={`border border-solid ${
                fieldErrors.Title ? "border-red" : "border-purple"
              } focus:border focus:border-solid focus:border-purple ${
                titleError ? "border-[1px] border-rose-500" : ""
              }`}
            />
          </div>

          <div className="Email my-2 relative">
            {!Email && (
              <p
                className={`text-rose-600 absolute text-lg  ${
                  i18n.language == "en" ? "left-[-1%]" : "right-[-2%]"
                }`}
              >
                *
              </p>
            )}
            <UiInput
              onFocus={() => setEmailError(false)}
              type="text"
              id="Email"
              label={t("Email")}
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("Email")}
              className={`border border-solid  border-purple focus:border focus:border-solid  focus:border-purple ${
                emailError ? "border-[1px] border-rose-500" : ""
              }`}
            />
          </div>
          <div className="phone">
            <label
              htmlFor="phone"
              className="flex items-center gap-2 font-jost text-base font-medium "
            >
              {t("Phone number")}
            </label>
            <div className=" flex relative">
              <PhoneInput
                name="phoneNumber"
                className={`flex flex-row border rounded-[10px]  w-full g ${
                  phoneError ? "border-rose-500" : "border-black"
                }`}
                value={Phone}
                onChange={(phone) => {
                  setPhone(phone);
                  setPhoneError(false);
                }}
                defaultCountry="sa"
                inputStyle={{
                  borderTopLeftRadius: i18n.language == "en" ? "0" : "10px",
                  borderBottomLeftRadius: i18n.language == "en" ? "0" : "10px",
                  borderTopRightRadius: i18n.language == "en" ? "10px" : "0",
                  borderBottomRightRadius: i18n.language == "en" ? "10px" : "0",
                  height: "44px",
                  width: "100%",
                  fontSize: "15px",
                }}
                countrySelectorStyleProps={{
                  flagStyle: {
                    borderRadius: "20px",
                    height: "20px",
                    objectFit: "fill",
                  },
                  buttonStyle: {
                    width: "60px",
                    height: "44px",
                    borderTopLeftRadius: i18n.language == "ar" ? "0" : "10px",
                    borderBottomLeftRadius:
                      i18n.language == "ar" ? "0" : "10px",
                    borderTopRightRadius: i18n.language == "ar" ? "10px" : "0",
                    borderBottomRightRadius:
                      i18n.language == "ar" ? "10px" : "0",
                  },
                }}
                prefix="+"
              />
              {!Phone && (
                <p
                  className={`text-rose-600 absolute text-lg  ${
                    i18n.language == "en"
                      ? "left-[-2%] bottom-9 "
                      : "right-[-2%] bottom-9"
                  }`}
                >
                  *
                </p>
              )}
            </div>
          </div>

          {/* Image Upload Input */}
          <div className="image my-2 relative">
            {!image && (
              <p
                className={`text-rose-600 absolute text-lg  ${
                  i18n.language == "en" ? "left-[-1%]" : "right-[-2%]"
                }`}
              >
                *
              </p>
            )}
            <label
              htmlFor="image"
              className="flex items-center gap-2 font-jost text-base font-medium "
            >
              {t("Image")}
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              onFocus={() => setImageError(false)}
              className={`w-full rounded-xl border border-purple font-jost font-normal text-base my-2 py-2 px-4 border-solid focus:border focus:border-purple focus:border-solid file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple file:text-white hover:file:bg-purple-dark ${
                imageError ? "border-[1px] border-rose-500" : ""
              }`}
            />
            {image && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {image.name}
              </p>
            )}
          </div>

          <div className="message relative">
            {!Message && (
              <p
                className={`text-rose-600 absolute text-lg  ${
                  i18n.language == "en"
                    ? "left-[-2%] top-2"
                    : "right-[-2%] top-2"
                }}`}
              >
                *
              </p>
            )}

            <label
              htmlFor="message"
              className="flex items-center gap-2 font-jost text-base font-medium "
            >
              {t("message")}
            </label>
            <textarea
              name="message"
              id="message"
              placeholder={t("How can we assist you?")}
              rows={6}
              onFocus={() => setMessageError(false)}
              value={Message}
              onChange={(e) => setMessage(e.target.value)}
              className={` ${
                messageError ? "border-[1px] border-rose-500" : ""
              }  bg-white  w-full   rounded-xl border border-purple font-jost font-normal text-base  my-2 py-2 px-4  border-solid  focus:border   focus:border-purple  focus:border-solid`}
            />
          </div>

          {error && (
            <div className="text-center">
              <p className="error text-red">{error}</p>
            </div>
          )}
          <div className="flex items-center justify-end gap-2 m-2">
            <Button type="submit" disabled={loading}>
              {loading ? t("loading") : t("save")}
            </Button>
          </div>
        </form>
      </div>
      <div className="image col-span-2 flex flex-col  justify-center items-center">
        <img src={ContactUsImage} alt="contact us" width={450} height={450} />
        <div className="flex flex-col ">
          <p className="flex items-center gap-2 text-base font-medium">
            <span>
              <CiLocationOn className="text-purple w-5 h-5" />
            </span>
            Saudi Arabia
          </p>
          <p className="flex items-center gap-2 text-base font-medium">
            <span>
              <FiPhone className="text-purple w-5 h-5" />
            </span>
            966569949865
          </p>
          <p className="flex items-center gap-2 text-base font-medium">
            <span>
              <CiMail className="text-purple w-5 h-5" />
            </span>
            info@request-sa.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Support;

import { Link, useNavigate } from "react-router-dom";
import AuthHeader from "../../../Components/authHeader/AuthHeader";
import image from "../../../assets/images/LogInMail.png";
import image2 from "../../../assets/images/sign-no-tagline-transparent-1500x1500 (1).png";
import "./style.scss";
import Button from "../../../Components/UI/Button/Button";
import { useEffect, useState } from "react";
import Loader from "../../../Components/Loader/Loader";
import { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../../Components/UI/Input/Input";
import { CiMail } from "react-icons/ci";
import { MdLockOutline } from "react-icons/md";
import { FaEye, FaPhoneAlt, FaRegEyeSlash } from "react-icons/fa";
import Google from "../../../assets/images/Google.png";
import Apple from "../../../assets/images/Apple.png";
import Facebook from "../../../assets/images/Facebook.png";
import { signInThunk } from "../../../redux/services/authServices";
import { toast } from "react-toastify";
import LandingHeader from "../../../Components/landingHeader/landingHeader";
import { motion } from "framer-motion";

const LoginByMail = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      return navigate("/home");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim values from the input fields
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Check if any trimmed field is empty
    if (!trimmedEmail || !trimmedPassword) {
      toast.error("Please fill in all fields.");
      return; // Exit the function if validation fails
    }

    setLoading(true);
    try {
      const result = await dispatch(
        signInThunk({ email: trimmedEmail, password: trimmedPassword })
      ).unwrap();

      const userData = result.userData;
      const token = result.token;

      navigate("/Otp", {
        state: {
          userData_login: userData,
          token,
          password_logIn: trimmedPassword,
          email_logIn: trimmedEmail,
        },
      });
    } catch (err) {
      console.error("Sign In failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="LogIn min-h-screen relative effect overflow-hidden bg-white">
        {loading || isLoading ? (
          <div className="loader flex justify-center items-center min-h-screen">
            <Loader />
          </div>
        ) : (
          <>
            <LandingHeader />

            {/* Main Content Container */}
            <div className="container mx-auto px-4 py-8 lg:py-16">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16">
                {/* Left Section - Text Content */}
                <div className="w-full lg:w-2/5 flex flex-col items-center lg:items-start text-center lg:text-left">
                  {/* Mobile Image */}
                  <div className="image_phone lg:hidden mb-6 relative bottom-4">
                    <motion.img
                      src={image}
                      alt="LogIn By Phone"
                      width={280}
                      height={280}
                      loading="lazy"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="mx-auto"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-workSans font-semibold text-purple lg:text-gray-dark lg:font-bold text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-4 lg:mb-6 max-w-md lg:max-w-none">
                    {t("sign in To activate your business easily")}
                  </h3>

                  {/* Desktop Register Link */}
                  <p className="font-jost font-medium text-lg lg:text-xl xl:text-2xl hidden lg:block">
                    {t("if you don't have an account you can")}
                    <Link
                      to="/SignUp/ChooseRole"
                      className="text-blue block mt-1 hover:underline transition-all duration-200"
                    >
                      {t("Register here!")}
                    </Link>
                  </p>
                </div>

                {/* Center Section - Desktop Image */}
                <div className="LogIn_Image hidden lg:flex justify-center lg:w-1/3">
                  <motion.img
                    src={image}
                    alt="LogIn By Phone"
                    width={400}
                    height={400}
                    loading="lazy"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="max-w-full h-auto"
                  />
                </div>

                {/* Right Section - Form */}
                <motion.div
                  className="form w-full lg:w-1/3 max-w-md mx-auto lg:mx-0"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div className="email">
                      <Input
                        placeholder="name@email.com"
                        type="email"
                        id="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        labelIcon={<CiMail />}
                        label={t("enter email")}
                        className="border border-purple border-solid bg-gray w-full"
                      />
                    </div>

                    {/* Password Input */}
                    <div className="password">
                      <Input
                        type="password"
                        placeholder={"••••••••"}
                        className="placeholder:font-normal placeholder:text-xl placeholder:font-inter w-full"
                        id="password"
                        autoComplete="password"
                        required
                        value={password}
                        label={t("Enter password")}
                        labelIcon={<MdLockOutline />}
                        onChange={(e) => setPassword(e.target.value)}
                        inputIcons={[
                          {
                            element: <FaRegEyeSlash className="text-gold" />,
                            type: "visibility",
                          },
                          {
                            element: <FaEye />,
                            type: "visibility",
                          },
                        ]}
                      />
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-left">
                      <Link
                        to={"/forgotPassword"}
                        className="forgot_Password text-purple underline underline-offset-1 font-normal text-sm hover:text-purple-dark transition-colors duration-200"
                      >
                        {t("Forgot Password?")}
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <Button
                      className="w-full flex justify-center items-center py-3 text-lg"
                      type="submit"
                    >
                      {t("signIn")}
                    </Button>

                    {/* Error Message */}
                    {error && (
                      <div className="text-center">
                        <p className="text-red text-sm">{error}</p>
                      </div>
                    )}
                  </form>

                  {/* Divider */}
                  <div className="my-6 flex items-center justify-center relative">
                    <span className="or px-4 bg-white text-gray-500 text-sm">
                      {t("or")}
                    </span>
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                  </div>

                  {/* Social Login Options */}
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="box_Google p-3 border border-gray-300 rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer">
                      <img src={Google} alt="Google" width={23} height={23} />
                    </div>
                    <div className="box_Apple p-3 border border-gray-300 rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer">
                      <img src={Apple} alt="Apple" width={23} height={23} />
                    </div>
                    <Link
                      to={"/LogIn"}
                      className="box_phone p-3 border border-gray-300 rounded-lg hover:shadow-md transition-shadow duration-200 flex items-center justify-center"
                    >
                      <FaPhoneAlt className="text-purple" size={20} />
                    </Link>
                  </div>

                  {/* Mobile Register Link */}
                  <p className="font-jost font-medium text-base text-center block lg:hidden">
                    {t("if you don't have an account you can")}
                    <Link
                      to="/SignUp/ChooseRole"
                      className="text-blue block mt-1 hover:underline transition-all duration-200"
                    >
                      {t("Register here!")}
                    </Link>
                  </p>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Section */}
      <div className=" py-12 px-4 bg-white">
        <div className="  w-fit flex me-auto flex-row items-center">
          <img src={image2} alt="" className="w-24" />
          <p className="text-gray-600 max-w-2xl leading-relaxed">
            {t("Code Skills Information Technology Company")}
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginByMail;

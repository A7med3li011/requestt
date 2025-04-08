import { Link, useNavigate } from "react-router-dom";
import AuthHeader from "../../../Components/authHeader/AuthHeader";
import image from "../../../assets/images/LogInMail.png";
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
  "Error object:", error;
  useEffect(() => {
    if (localStorage.getItem("token")) {
      return navigate("/");
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
    <div className="LogIn h-full relative  effect overflow-hidden ">
      {loading || isLoading ? (
        <div className="loader flex justify-center items-center  m-auto">
          <Loader />
        </div>
      ) : (
        <>
          <LandingHeader />
          <div className="Wrapper flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="w-full  md:w-1/2 lg:w-2/5 flex  flex-col items-center  mt-14  md:my-40">
              <div className="image_phone md:hidden">
                <img
                  src={image}
                  alt="LogIn By Phone"
                  width={300}
                  height={300}
                  loading="lazy"
                  whileHover={{ scale: 1.05 }}
                />
              </div>
              <h3 className="font-workSans font-semibold text-purple text-center md:text-left md:text-gray-dark md:font-bold text-xl md:text-3xl lg:text-5xl">
                {t("sign in To activate your business easily")}
              </h3>
              <p className="font-jost font-medium  hidden md:block md:text-xl lg:text-2xl">
                {t("if you don't have an account you can")}
                <Link to="/SignUp/ChooseRole" className="text-blue block">
                  {t("Register here!")}
                </Link>
              </p>
            </div>
            <div className="LogIn_Image md:flex justify-center hidden">
              <motion.img
                src={image}
                alt="LogIn By Phone"
                width={500}
                height={500}
                loading="lazy"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </div>
            <motion.div
              className="form flex flex-col mt-14 "
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <form onSubmit={handleSubmit}>
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
                    className="border border-purple border-solid bg-gray"
                  />
                </div>

                <div className="password">
                  <Input
                    type="password"
                    placeholder={"••••••••"}
                    className="placeholder:font-normal placeholder:text-xl placeholder:font-inter"
                    id="password"
                    autoComplete="password"
                    required
                    value={password}
                    label={t("Enter password")}
                    labelIcon={<MdLockOutline />}
                    onChange={(e) => setPassword(e.target.value)}
                    // minLength={8}
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
                <Link
                  to={"/forgotPassword"}
                  className="forgot_Password text-purple   underline underline-offset-1 font-normal  text-sm"
                >
                  {t("Forgot Password?")}
                </Link>

                <Button
                  className="mt-5 w-full  flex justify-center  items-center"
                  type="submit"
                >
                  {t("signIn")}
                </Button>
                {error && (
                  <div className="text-center">
                    <p className="text-red">{error}</p>
                  </div>
                )}
              </form>
              <div className="my-2 flex items-center justify-center relative">
                <span className="or">{t("or")}</span>
              </div>
              <div className="flex items-center justify-between mt-4 gap-4">
                <div className="box_Google">
                  <img src={Google} alt="Google" width={23} height={28} />
                </div>
                <div className="box_Apple">
                  <img src={Apple} alt="Apple" width={23} height={28} />
                </div>
                <Link to={"/LogIn"} className="box_phone">
                  <FaPhoneAlt className="text-purple" />
                </Link>
              </div>
              <p className="font-jost font-medium  text-lg text-center block md:hidden my-4">
                {t("if you don't have an account you can")}
                <Link to="/SignUp/ChooseRole" className="text-blue block">
                  {t("Register here!")}
                </Link>
              </p>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginByMail;

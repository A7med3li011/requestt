import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AuthHeader from "../../../Components/authHeader/AuthHeader";
import Loader from "../../../Components/Loader/Loader";
import Input from "../../../Components/UI/Input/Input";
import Button from "../../../Components/UI/Button/Button";
import { t } from "i18next";
import forgot from "../../../assets/images/forgot.png";
import { forgetPassword, updateUser } from "../../../Services/api";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import LandingHeader from "../../../Components/landingHeader/landingHeader";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { forget_id } = location.state || {};

   useEffect(() => {
      if (localStorage.getItem("token")) {
        return navigate("/");
      }
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (forget_id) {
        "userId:", forget_id, "password:", password;
        const result = await updateUser(forget_id, {
          password,
        });
        result;
        navigate("/LogIn/Mail");
      } else {
        const forget = await forgetPassword(email);
        forget;
        console.log("yes");
        setSearchParams({"email":email})
        navigate(`/Otp/`, { state: { forget_email: email, forget } });
      }
    } catch (err) {
      setError(t("Email not found"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ForgotPassword h-screen relative effect overflow-hidden">
      {loading ? (
        <div className="loader flex justify-center items-center m-auto">
          <Loader />
        </div>
      ) : (
        <>
          <LandingHeader />
          <div className="Wrapper flex flex-col lg:flex-row md:items-center md:justify-between">
            <div className="w-full  md:w-1/2 lg:w-2/5 flex  flex-col items-center  mt-14  md:my-40">
              <div className="image_phone md:hidden">
                <img
                  src={forgot}
                  alt="LogIn By Phone"
                  width={300}
                  height={300}
                  loading="lazy"
                />
              </div>

              {forget_id ? (
                <>
                  <h3 className="font-workSans font-semibold text-purple text-center md:text-left md:text-gray-dark md:font-bold text-xl md:text-3xl lg:text-5xl">
                    {t("Reset Your Password")}
                  </h3>
                  <p className="font-jost font-medium  hidden md:block md:text-xl lg:text-2xl">
                    {t("Enter your new password below to complete the reset")}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-workSans font-semibold text-purple text-center md:text-left md:text-gray-dark md:font-bold text-xl md:text-3xl lg:text-5xl">
                    {t("Enter your email to reset the password")}
                  </h3>
                  <p className="font-jost font-medium  hidden md:block md:text-xl lg:text-2xl">
                    {t(
                      "You will receive a code in your email that must be entered to reset your password"
                    )}
                  </p>
                </>
              )}
            </div>

            <div className="LogIn_Image hidden md:flex justify-center">
              <img
                src={forgot}
                alt="Forgot Password"
                width={600}
                loading="lazy"
              />
            </div>
            <div className="form flex flex-col md:mt-14">
              <form onSubmit={handleSubmit}>
                {forget_id ? (
                  <div className="password">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("Enter New Password")}
                      id="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={8}
                      inputIcons={[
                        {
                          element: (
                            <FaRegEyeSlash
                              className="text-gold cursor-pointer"
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          ),
                          type: "visibility",
                        },
                        {
                          element: (
                            <FaEye
                              className="text-gold cursor-pointer"
                              onClick={() => setShowPassword(!showPassword)}
                            />
                          ),
                          type: "visibility",
                        },
                      ]}
                    />
                  </div>
                ) : (
                  <div className="email">
                    <Input
                      placeholder={t("enter email")}
                      type="email"
                      id="email"
                      autoComplete="email"
                      autoFocus
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}

                <div className="flex justify-center items-center">
                  <Button className="mt-5  " type="submit" disabled={loading}>
                    {t("Send")}
                  </Button>
                </div>
                {error && (
                  <div className="text-center">
                    <p className="text-red">{error}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;

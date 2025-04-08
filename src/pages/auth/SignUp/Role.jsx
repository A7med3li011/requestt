import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import AuthHeader from "../../../Components/authHeader/AuthHeader";
import Button from "../../../Components/UI/Button/Button";
import "./style.scss";
import { useSelector } from "react-redux";
import Loader from "../../../Components/Loader/Loader";
import LandingHeader from "../../../Components/landingHeader/landingHeader";

const Role = () => {
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { isLoading } = useSelector((state) => state.auth);

  // Static roles
  const roles = [
    { _id: "66d33a4b4ad80e468f231f83", name: "owner", label: t("owner") },
    {
      _id: "66d33ec44ad80e468f231f91",
      name: "contractor",
      label: t("contractor"),
    },
    {
      _id: "66d33e7a4ad80e468f231f8d",
      name: "consultant",
      label: t("consultant"),
    },
  ];
  useEffect(() => {
    if (localStorage.getItem("token")) {
      return navigate("/");
    }
  }, []);
  const handleRoleSelect = (roleId) => {
    if (selectedRoleId === roleId) {
      setSelectedRoleId("");
    } else {
      setSelectedRoleId(roleId);
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedRoleId) {
      setError("Please select a role.");
      return;
    }

    // Navigate to SignUp page with the selected role ID
    navigate("/SignUp", { state: { roleId: selectedRoleId } });
  };

  return (
    <div className="Role effect ">
      {isLoading ? (
        <div className="loader flex justify-center items-center  m-auto ">
          <Loader />
        </div>
      ) : (
        <>
          <LandingHeader />
          <div className="Wrapper flex flex-col justify-center">
            <div className="flex items-start justify-center flex-col mt-16">
              <h3 className="font-inter font-bold text-xl md:text-3xl lg:text-5xl leading-[50px] max-w-[745px] text-purple-dark">
                {t("What kind of customer are you?")}
              </h3>
              <p className="font-inter font-light text-base md:text-lg lg:text-xl leading-8 max-w-[600px]">
                {t(
                  "Select from the following options to be directed to the appropriate page"
                )}
              </p>
            </div>
            <div className="Buttons flex flex-col md:flex-row justify-center items-center gap-10 md:gap-24 lg:gap-32 my-10">
              {roles.map((role) => (
                <button
                  key={role._id}
                  className={`RoleBtn ${role.name} ${
                    selectedRoleId === role._id ? "selected" : ""
                  }`}
                  onClick={() => handleRoleSelect(role._id)}
                >
                  {role.label}
                </button>
              ))}
            </div>
            {error && (
              <div className="text-center text-red">
                <p>{error}</p>
              </div>
            )}
            <div className="Next flex items-center justify-center mt-5">
              <Button onClick={handleSubmit} disabled={!selectedRoleId}>
                {t("Next")}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Role;

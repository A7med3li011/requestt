import { t } from "i18next";
import Input from "../../../Components/UI/Input/Input";
import Select from "../../../Components/UI/Select/Select";
import { CiSquarePlus, CiSquareRemove } from "react-icons/ci";
import Button from "../../../Components/UI/Button/Button";
import { useState } from "react";
import { sendInvite } from "../../../Services/api";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Invite = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [invites, setInvites] = useState([{ email: "", type: "" , comment :""}]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [fieldErrors, setFieldErrors] = useState({});
  const { projectId, projectName, fromProject } = location.state || {};
  const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    for (const invite of invites) {
      if (!invite.email.trim()) {
        setError(t("Email can not be empty"));
        return;
      }
      if (!emailPattern.test(invite.email.trim())) {
        setError(t("This Email is not valid"));
        return;
      }
         if (invite.email.trim() === user.email) {
           setError(t("You cannot invite yourself"));
           return;
         }
      if (!invite.type) {
        setError(t("role required"));
        return;
      }
    }

    try {
      const payload = invites.map(({ email, type, comment }) => ({
        email: email.trim(),
        role: type,
        project: projectId,
        createdBy: user._id,
        comment,
        projectName,
      })); 
      (payload);

      await sendInvite(token, payload);
      toast.success(t("toast.inviteSuccess"));

      setInvites([{ email: "", type: null, comment: "" }]);
      if(fromProject === true) {
         navigate("/Projects");
      } else{
         navigate("/Models", {
           state: {
             projectId,
             projectName,
           },
         });
      }
     
      setLoading(false);
    } catch (err) {
      console.error("Error in adding new invite", err);
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  const addNewInvite = () => {
    const newInvite = { email: "", type: "", comment : "" };
    setInvites((prevInvites) => [...prevInvites, newInvite]);
  };

  const handleInviteChange = (index, field, value) => {
    const updatedInvites = invites.map((invite, i) =>
      i === index ? { ...invite, [field]: value } : invite
    );
    setInvites(updatedInvites);
  };

  const removeInvite = (index) => {
    setInvites(invites.filter((_, i) => i !== index));
  };

  return (
    <div className="Invite mx-1">
      <h1 className="title font-inter font-bold text-3xl text-black m-2">
        {t("invite")}
      </h1>
      <div className="wrapper bg-white rounded-3xl p-3 m-2">
        <form>
          {invites.map((invite, index) => (
            <div
              key={index}
              className="invite-item flex flex-col justify-around lg:flex-row gap-x-4 mb-2 "
            >
              <div className="lg:w-1/4 w-2/3 mx-auto">
                <Input
                  className="bg-white border   border-purple border-solid focus:border-purple focus:border focus:border-solid"
                  label={t("invite")}
                  placeholder={t("Email")}
                  type={"email"}
                  autoComplete="email"
                  required
                  value={invite.email}
                  onChange={(e) =>
                    handleInviteChange(index, "email", e.target.value)
                  }
                />
              </div>
              <div className="lg:w-1/4 w-2/3 mx-auto">
                <Input
                  className="bg-white border border-purple border-solid focus:border-purple focus:border focus:border-solid"
                  label={`${t("Comment")} ${t("(not required)")}`}
                  placeholder={t("Comment")}
                  type={"text"}
                  autoComplete="text"
                  required
                  value={invite.comment}
                  onChange={(e) =>
                    handleInviteChange(index, "comment", e.target.value)
                  }
                />
              </div>
              <div className="lg:w-1/4 w-2/3 mx-auto">
                <Select
                  label={t("type")}
                  options={roles.map((role) => ({
                    label: role.label,
                    value: role._id,
                  }))}
                  placeholder={t("role")}
                  value={invite.type}
                  onChange={(value) => handleInviteChange(index, "type", value)}
                />
              </div>

              <div className=" flex items-center justify-center gap-2 mt-3 w-full lg:w-10 ">
                {index === 0 && (
                  <button
                    type="button"
                    disabled={invites.length === 5}
                    onClick={addNewInvite}
                    className=" w-2/3 lg:w-10"
                  >
                    <CiSquarePlus
                      className={`w-full lg:w-10 h-10 bg-yellow ${
                        invites.length === 5 ? "opacity-45 " : ""
                      }  text-white rounded-lg`}
                    />
                  </button>
                )}
                {index > 0 && (
                  <button type="button" onClick={() => removeInvite(index)}>
                    <CiSquareRemove className="w-10 h-10 text-red" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {error && <p className="error text-red text-center">{error}</p>}
          <div className="col-span-6 flex justify-end mt-4">
            <Button onClick={handleSubmit}>{t("invite")}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Invite;

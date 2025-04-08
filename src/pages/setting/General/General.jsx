import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { MdOutlineLanguage } from "react-icons/md";
import "./style.scss";
import Button from "../../../Components/UI/Button/Button";
import ContactUs from "../../../assets/images/ContactUs.svg";
import { Link } from "react-router-dom";
import { CheckInput } from "../setting";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateUserPreferences } from "../../../redux/slices/authSlice";


function Wrapper({ head, paragraph, checked, onToggle }) {
  return (
    <div className="flex items-center justify-between my-3 gap-3">
      <div className="flex flex-col mx-2">
        <h6 className="font-normal lg:font-medium text-sm lg:text-base leading-5">{head}</h6>
        <p
          className="font-light lg:font-normal tex-xs lg:text-sm leading-5 max-w-[320px] lg:max-w-[600px]"
          style={{ color: "#9095A1" }}
        >
          {paragraph}
        </p>
      </div>
      <div className="toggle">
        <CheckInput checked={checked} onChange={onToggle} />
      </div>
    </div>
  );
}

const General = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { changeLanguage } = useLanguage();

  const [languageChecked, setLanguageChecked] = useState(
    user.languageChecked || false
  );
  const [offersChecked, setOffersChecked] = useState(
    user.offersAndPackages || false
  );
  const [notificationsChecked, setNotificationsChecked] = useState(
    user.notifications || false
  );
  const [renewalChecked, setRenewalChecked] = useState(
    user.renewalSubscription || false
  );

  useImperativeHandle(ref, () => ({
    handleSave: () => {
      changeLanguage(languageChecked ? "ar" : "en");

      // Update user object
      const updatedUser = {
        ...user,
        languageChecked,
        offersAndPackages: offersChecked,
        notifications: notificationsChecked,
        renewalSubscription: renewalChecked,
      };
      // Save updated user to Redux and localStorage
      dispatch(updateUserPreferences(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
    },
  }));

  return (
    <div className="General">
      <div className="lang flex items-center justify-between my-3">
        <div className="flex items-center">
          <span
            className="p-2 rounded-md mx-1"
            style={{
              boxShadow: "0px 0px 1px 0px #0000000A",
              background: "#CCABDA08",
            }}
          >
            <MdOutlineLanguage
              className="w-5 h-5"
              style={{ color: "#CCABDA" }}
            />
          </span>
          <span className="font-semibold text-base">{t("En/Ar")}</span>
        </div>
        <div className="toggle">
          <CheckInput
            checked={languageChecked}
            onChange={() => {
              setLanguageChecked(!languageChecked);
            }}
          />
        </div>
      </div>
      <Wrapper
        head={t("Offers and packages")}
        paragraph={t("Sending all new offers and packages via email")}
        checked={offersChecked}
        onToggle={() => setOffersChecked(!offersChecked)}
      />
      <Wrapper
        head={t("Notifications")}
        paragraph={t("Sending a new notification to the registered email")}
        checked={notificationsChecked}
        onToggle={() => setNotificationsChecked(!notificationsChecked)}
      />
      <Wrapper
        head={t("Renewal of the subscription")}
        paragraph={t(
          "Notifications before the monthly balance expires and the payment due date approaches."
        )}
        checked={renewalChecked}
        onToggle={() => setRenewalChecked(!renewalChecked)}
      />
      <div className="msg shadow-md flex flex-col  lg:flex-row items-center lg:justify-between rounded-2xl mt-10">
        <div className="content flex flex-col p-4">
          <h6
            className="font-normal text-xl leading-5 my-1"
            style={{ color: "#7E7E7E" }}
          >
            {t("Contact us")}
          </h6>
          <h5 className="font-semibold text-lg md:tex-xl lg:text-2xl text-purple my-1">
            {t("We are waiting for you")}
          </h5>
          <p
            className="font-light text-xs md:text-sm leading-5 max-w-[620px] my-1"
            style={{ color: "#5E5E5E" }}
          >
            {t(
              "Do not hesitate to leave us a message about your problem or suggestion, and the support team will reply to you."
            )}
          </p>
          <Link to={"/ContactUs"}>
            <Button className={"px-8 md:px-12 lg:px-14 mt-2"}>
              {t("Contact us")}
            </Button>
          </Link>
        </div>
        <div className="image">
          <img src={ContactUs} alt="ContactUs" width={250} height={50} />
        </div>
      </div>
    </div>
  );
});

export default General;

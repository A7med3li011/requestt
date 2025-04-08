import { Divider } from "@mui/material";
import React, { useState } from "react";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { FaBookmark } from "react-icons/fa";
import { IoInformationCircleOutline } from "react-icons/io5";
import Button from "../../Components/UI/Button/Button";
import Input from "../../Components/UI/Input/Input";
import { Option, Select } from "@mui/joy";
import masterCard from "../../assets/images/MasterCard.png";
import { t } from "i18next";
const PlansDetailsLanding = () => {
     const [selectedPlan, setSelectedPlan] = useState("Request");

     const plans = [
       {
         name: "Request",
         price: "$8 USD",
         description: t("Best for personal use"),
         badge: t("Active Plan"),
         badgeColor: "bg-green text-white",
       },
       {
         name: "Request Plus",
         price: "$16",
         description: t("Best for personal use"),
       },
       {
         name: "Request Full Plus",
         price: t("Custom"),
         description: t("Best for personal use"),
       },
     ];
  return (
    <div className="PlanDetails bg-white p-2 rounded-3xl">
      <h2 className="font-semibold text-xl">{t("Subscription System")}</h2>
      <div className="boxes grid grid-cols-2 md:grid-cols-4 gap-2 mt-5 mx-2">
        <div className="package_box border border-gray py-2 px-4 rounded-xl col-span-2">
          <div className="flex my-1">
            <span className="rounded-lg">
              <FaBookmark className="text-gold w-4 h-4" />
            </span>
          </div>
          <h4 className="font-semibold text-sm my-1">
            {t("You are on the Request package")}
          </h4>
          <p className="text-xs font-normal my-1 mr-4">
            {t(
              "You enjoy the monthly package. You can subscribe to the annual package and save 20%"
            )}
          </p>
        </div>
        <div
          className="upgrade_box border border-purple py-2 px-4 rounded-xl col-span-2"
          style={{
            backgroundColor: "rgba(204, 171, 218, 0.09)",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between my-1">
            <span className="rounded-lg">
              <BsFillLightningChargeFill className="text-purple-dark w-4 h-4" />
            </span>
            <span className="bg-linear_1 py-1 px-3 text-white rounded-3xl">
              {t("Upgrade")}
            </span>
          </div>
          <h4 className="font-semibold text-sm my-1">
            {t("Upgrade the package")}
          </h4>
          <p className="text-xs font-normal my-1 mr-4">
            {t(
              "You can change the package to a larger package and enjoy greater privileges"
            )}
          </p>
        </div>
      </div>
      <hr className="my-4" />
      <div className="flex items-center justify-between mt-5 mx-2">
        <div className="content">
          <h6 className="text-xs my-1" style={{ color: "#919EAB" }}>
            {t("Current Plan")}
          </h6>
          <h1 className="font-bold text-2xl my-1">
            {t("Starter - ")} Jan 2024
          </h1>
          <p className="text-gray-md font-medium text-sm my-1">
            {t("You enjoy the benefits of the Request package")}
          </p>
          <p className="flex items-center gap-2 font-medium text-sm text-gray my-1">
            <span>
              <IoInformationCircleOutline />
            </span>
            {t("Next Payment:")} <span className="text-purple">$8 USD</span>{" "}
            {t("on")} <span className="text-gray-dark">Feb 1, 2024</span>
          </p>
        </div>
        <div className="flex flex-col">
          <h6 className="text-xs font-bold my-3" style={{ color: "#919EAB" }}>
            {t("Yearly Payment")}
          </h6>
          <span className="Price text-purple font-bold text-3xl">$8 USD</span>
          <p className="underline underline-offset-1 text-gray font-medium text-xs">
            {t("Learn more about our membership policy")}
          </p>
          <Button className={"px-20 my-3"}>{t("Change Plan")}</Button>
        </div>
      </div>
      <form action="submit" className="mx-2">
        <Input
          label={t("Name")}
          className="bg-white border border-solid border-gray focus:border focus:border-solid focus:border-gray"
          id={"name"}
          placeholder={t("Name")}
          required={true}
        />
        <div className="grid grid-cols-2">
          <div className="col-span-1">
            <Input
              label={t("Price")}
              className="bg-white border border-solid border-gray focus:border focus:border-solid focus:border-gray"
              id={"Price"}
              placeholder={t("Price")}
              required={true}
            />
          </div>
          <div className="col-span-1">
            <label
              htmlFor="Billing"
              className="Input_label flex items-center justify-start gap-2 font-jost text-base font-medium mx-2"
            >
              {t("Billing Period")}
            </label>
            <Select label={t("Billing Period")} id="Billing" className="my-2">
              <Option value="monthly">{t("Monthly")}</Option>
              <Option value="yearly">{t("Yearly")}</Option>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2 my-1">
          <input type="checkbox" name="Notify" id="Notify" />
          <label htmlFor="Notify" className="text-sm font-medium">
            {t("Notify me of new offers via email")}
          </label>
        </div>
        <div className="flex items-center gap-2 my-1">
          <input type="checkbox" name="renewal" id="renewal" />
          <label htmlFor="renewal" className="text-sm font-medium">
            {t("Automatic renewal")}
          </label>
        </div>
        <div className="flex items-center gap-2 my-1">
          <input type="checkbox" name="Notification" id="Notification" />
          <label htmlFor="Notification" className="text-sm font-medium">
            {t("Notification before the package expires")}
          </label>
        </div>

        <Input
          label={t("Days")}
          className="bg-white border border-solid border-gray focus:border focus:border-solid focus:border-gray"
          id={"Days"}
          placeholder={t("Days")}
          required={true}
        />
      </form>
      <div className="payment flex items-center justify-between mx-2">
        <div className="flex flex-col">
          <h2 className="text-xs my-1" style={{ color: "#919EAB" }}>
            {t("Payment method")}
          </h2>
          <div className="flex items-center gap-2">
            <img src={masterCard} alt="masterCard" className="w-16 " />
            <span className="font-bold text-xl">***8773</span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <button className="text-red text-sm font-medium">
            {t("Remove")}
          </button>
          <button className="font-semibold text-sm">{t("Change card")}</button>
        </div>
      </div>
      <div className="upgrade mx-2 mt-5">
        <h3 className="text-gold m-3 font-bold text-xl">
          {t("Update Your Plan")}
        </h3>
        <h5 className="my-3 mx-7 font-bold text-base">
          {t("Change your plan")}
        </h5>
        <p className="my-3 mx-7 font-gray font-medium text-sm">
          {t("You can choose from one of the available plans below.")}
        </p>
        <div className="bg-white rounded-lg shadow-md p-4 w-full ">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 border-b ${
                index === 0 ? "border-transparent" : "border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id={plan.name}
                  name="plan"
                  checked={selectedPlan === plan.name}
                  onChange={() => setSelectedPlan(plan.name)}
                  className="w-5 h-5 text-green focus:ring-green border-gray-300"
                />
                <div className="flex flex-col">
                  <span className="font-bold">{plan.name}</span>
                  <span className="text-gray-600">{plan.description}</span>
                </div>
              </div>
              <div className="text-lg font-bold">{plan.price}</div>
              {plan.badge && (
                <span
                  className={`text-xs font-medium ${plan.badgeColor} px-2 py-1 rounded-lg`}
                >
                  {plan.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlansDetailsLanding;

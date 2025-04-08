import { IoInformationCircleOutline } from "react-icons/io5";
import Button from "../../Components/UI/Button/Button";
import StatusHeader from "../../Components/StatusHeader/StatusHeader";
import mastercardLogo from "../../assets/images/MasterCard.png";
import { useState } from "react";
import { MdOutlineMoreHoriz } from "react-icons/md";
import Input from "../../Components/UI/Input/Input";
import "./style.scss";
import Card from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
} from "../../utils/Payment";
import { FaApple, FaGoogle } from "react-icons/fa6";
import { TbCreditCardPay } from "react-icons/tb";
import { t } from "i18next";
const Payments = () => {
  const [selectedTab, setSelectedTab] = useState("card");
  const [defaultCard, setDefaultCard] = useState(true);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    issuer: "",
    focused: "",
  });

  const handleTabClick = (tab) => setSelectedTab(tab);

  const handleInputFocus = ({ target }) => {
    setCardDetails((prevState) => ({
      ...prevState,
      focused: target.name,
    }));
  };

  const handleInputChange = ({ target }) => {
    let value = target.value;

    if (target.name === "number") value = formatCreditCardNumber(value);
    else if (target.name === "expiry") value = formatExpirationDate(value);
    else if (target.name === "cvc") value = formatCVC(value);

    setCardDetails((prevState) => ({
      ...prevState,
      [target.name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ("You have finished payment!");
  };

  const { number, name, expiry, cvc, focused, issuer } = cardDetails;

  return (
    <div className="Payments bg-white p-2 m-2 rounded-3xl">
      <div className="header p-2">
        <h3 className="font-medium md:font-semibold text-base">
          {t("Payment methods")}
        </h3>
        <p
          className="text-xs font-normal"
          style={{
            color: "#637381",
          }}
        >
          {t(
            "Please go ahead and enter your preferred payment method below. You can use a credit/debit card or prepay through Google Pay, Apple Pay."
          )}
        </p>
      </div>
      <div className="flex items-center flex-col md:flex-row md:justify-between mt-5 mx-2">
        <div className="content">
          <h6
            style={{
              color: "#919EAB",
            }}
            className="text-xs my-1"
          >
            {t("Current Plan")}
          </h6>
          <h1 className="font-bold text-2xl my-1">
            {t("Starter - ")} Jan 2024
          </h1>
          <p className="text-gray-md  font-medium text-sm my-1">
            {t("You enjoy the benefits of the Request package.")}
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
          <h6
            style={{
              color: "#919EAB",
            }}
            className="text-xs font-bold  my-3"
          >
            {t("Yearly Payment")}
          </h6>
          <span className="Price text-purple font-bold text-3xl">$8 USD</span>
          <p className="underline underline-offset-1 text-gray  font-medium  text-xs">
            {t(`Learn more about our membership policy.`)}
          </p>
          <Button className={"px-20 my-3"}>{t("Change Plan")}</Button>
        </div>
      </div>
      <hr className="bg-gray my-4" />
      <div className="flex gap-4 mb-6 mt-5">
        {["card", "google", "apple"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded font-bold text-sm ${
              selectedTab === tab
                ? "text-purple-dark border-b-2 border-purple-dark"
                : "text-gray"
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab === "card" && "Debit / Credit Card"}
            {tab === "google" && "Google Pay"}
            {tab === "apple" && "Apple Pay"}
          </button>
        ))}
      </div>

      {selectedTab === "card" && (
        <div className="card p-4">
          <h4 className="font-medium text-base">
            {t("Credit or debit cards")}
          </h4>
          <p className="text-xs font-normal" style={{ color: "#637381" }}>
            {t(
              "The card will be charged monthly for resources used. All major credit/debit cards are accepted."
            )}
          </p>

          {/* Existing Cards Section */}
          <div className="bg-white border border-gray rounded-2xl p-6 mt-4 mb-8">
            {[{ expired: false }, { expired: true }].map((card, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center gap-4">
                  <img src={mastercardLogo} alt="MasterCard" className="w-12" />
                  <div>
                    <p className="font-bold">
                      Ahmed Hassan{" "}
                      <span style={{ color: "#637381" }}>xxxx-1234</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("Expires")} 10/202{index + 4} • {t("Updated on")} 12
                      Jan 2021
                    </p>
                  </div>
                </div>
                <span
                  className={`${
                    card.expired ? "bg-red" : "bg-purple-dark"
                  } text-white text-xs px-2 py-1 rounded`}
                >
                  {card.expired ? t("Expired") : t("Default")}
                </span>
                <MdOutlineMoreHoriz className="text-gray-500 cursor-pointer" />
              </div>
            ))}
          </div>
          <div className="AddNewCard flex ">
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-bold mb-4">{t("Add new card")}</h3>
              <div className="flex items-center flex-col md:flex-row md:justify-between  gap-5">
                <Card
                  number={number}
                  name={name}
                  expiry={expiry}
                  cvc={cvc}
                  focused={focused}
                  callback={({ issuer }, isValid) => {
                    if (isValid) {
                      setCardDetails((prev) => ({ ...prev, issuer }));
                      // Adjust CVV length for Amex cards
                      if (issuer === "amex") {
                        document
                          .querySelector('input[name="cvc"]')
                          .setAttribute("maxlength", "4");
                      } else {
                        document
                          .querySelector('input[name="cvc"]')
                          .setAttribute("maxlength", "3");
                      }
                    }
                  }}
                />
                <form className="grid grid-cols-4 gap-6 ">
                  <div className="col-span-4">
                    <label className=" mb-2 flex items-center justify-start text-sm font-medium">
                      {t("Card holder Name")}
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg"
                      placeholder="Name"
                      pattern="[a-zA-Z ]+"
                      maxlength="30"
                      required
                      name="name"
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                    />
                  </div>

                  <div className="cardNumber col-span-4 md:col-span-2">
                    <Input
                      label={t("Card Number")}
                      placeholder={"XXXX XXXX XXXX XXXX"}
                      inputmode="numeric"
                      pattern="[\d| ]{16,22}"
                      autocomplete="cc-number"
                      maxlength="16"
                      name="number"
                      type={"tel"}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      className="bg-white border border-gray border-solid focus:border-gray focus:border focus:border-solid"
                    />
                  </div>

                  <div className="col-span-4 md:col-span-2 lg:col-span-1">
                    <label className=" mb-2 flex items-center justify-start text-sm font-medium">
                      {t("Expiration Date")}
                    </label>
                    <input
                      type="tel"
                      name="expiry"
                      placeholder="MM/YY"
                      pattern="\d\d/\d\d"
                      className="w-full p-2 border rounded-lg"
                      required
                      value={expiry}
                      maxLength={5}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                    />
                  </div>

                  <div className="col-span-4 md:col-span-2 lg:col-span-1 ">
                    <label className=" mb-2 flex items-center justify-start text-sm font-medium">
                      {t("CVV Code")}
                    </label>
                    <input
                      className="w-full p-2 border rounded-lg"
                      type="tel"
                      name="cvc"
                      placeholder="CVC"
                      pattern="\d{3,4}"
                      maxLength={3}
                      required
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                    />
                  </div>

                  <div className="col-span-4">
                    <label className="flex items-center gap-2 font-medium text-base select-none">
                      <input
                        type="checkbox"
                        className="appearance-none w-3 h-3 border border-gray rounded-sm cursor-pointer checked:bg-purple checked:border-purple duration-500"
                      />
                      <span>{t("Make this my default payment method")}</span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="col-span-4  text-center  px-0"
                    disabled={true}
                  >
                    {t("Confirm and pay")}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {(selectedTab === "google" || selectedTab === "apple") && (
        <div className=" p-4 ">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border p-2 rounded-lg ">
                <span>
                  {selectedTab === "apple" ? (
                    <FaApple />
                  ) : selectedTab === "google" ? (
                    <FaGoogle />
                  ) : (
                    ""
                  )}
                </span>
                <span className="font-medium text-lg">{t("pay")}</span>
              </div>
              <h3 className="font-semibold  text-2xl">
                {selectedTab === "apple"
                  ? "Apple"
                  : selectedTab === "google"
                  ? "Goggle"
                  : ""}{" "}
                Pay{" "}
              </h3>
            </div>
            <p className="font-medium text-base">
              {selectedTab === "apple"
                ? t("Apple Pay selected for checkout.")
                : selectedTab === "google"
                ? t("Google Pay selected for checkout.")
                : ""}
            </p>
          </div>
          <hr className="bg-gray my-4" />
          <div className="email">
            <label className=" mb-2 flex items-center justify-start text-sm font-medium">
              {t("Email")}
            </label>
            <input
              type="mail"
              name="mail"
              placeholder="name@gmail.com"
              pattern="/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;"
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div className="flex items-center gap-2 my-5">
            <span>
              <TbCreditCardPay className="text-gray w-8 h-8" />
            </span>
            <p className="font-normal text-sm">
              {selectedTab === "apple"
                ? t(
                    "After submitting your order, scan the QR code using Apple Pay."
                  )
                : selectedTab === "google"
                ? t(
                    "After submitting your order, scan the QR code using Google Pay."
                  )
                : ""}{" "}
            </p>
          </div>
          <Button type="submit" className="  text-center  px-0 w-full">
            {t("Confirm and pay")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Payments;

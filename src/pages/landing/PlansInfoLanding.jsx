import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from "@mui/material";
import SwitchTabs from "../../Components/switchTabs/SwitchTabs";
import Button from "../../Components/UI/Button/Button";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { t } from "i18next";

const tableData = [
  {
    section: t("Task Management"),
    features: [
      {
        name: t("Customizable Workflows"),
        request: false,
        requestPlus: true,
        fullPlus: true,
      },
      {
        name: t("Project Planning"),
        request: true,
        requestPlus: true,
        fullPlus: true,
      },
      {
        name: t("Time Line"),
        request: false,
        requestPlus: true,
        fullPlus: true,
      },
    ],
  },
  {
    section: t("Visualization"),
    features: [
      {
        name: t("Gantt Charts"),
        request: false,
        requestPlus: true,
        fullPlus: true,
      },
      {
        name: t("Certified Extracts"),
        request: false,
        requestPlus: false,
        fullPlus: true,
      },
      {
        name: t("Weekly Reports"),
        request: false,
        requestPlus: true,
        fullPlus: true,
      },
      {
        name: t("Add team members"),
        request: t("3 accounts"),
        requestPlus: t("6 accounts"),
        fullPlus: t("9 accounts"),
      },
    ],
  },
  {
    section: t("Integrations"),
    features: [
      {
        name: t("Number of Projects"),
        request: 2,
        requestPlus: 5,
        fullPlus: 10,
      },
      {
        name: t("Mobile App Integration"),
        request: false,
        requestPlus: true,
        fullPlus: true,
      },
      {
        name: t("Storage Space (GB)"),
        request: 15,
        requestPlus: 30,
        fullPlus: 100,
      },
    ],
  },
];

const PlansInfoLanding = () => {
  return (
    <div className="PlansInfo">
      <div className="header  flex flex-col  gap-3 md:flex-row md:justify-between md:items-center mb-4 mx-2">
        <div className="content ">
          <h2 className="font-bold text-xl">{t("Feature Table")}</h2>
          <p className="text-base text-gray-500">
            {t("Choose the perfect plan for your business needs")}
          </p>
        </div>
        <div className="switch flex flex-col lg:flex-row  gap-2  lg:items-center">
          <span className="text-purple-dark">
            {t("Save 15% on yearly plan!")}
          </span>
          <SwitchTabs
            data={[t("Yearly"), t("Monthly")]}
            main_style={"bg-white"}
            activeTab_style={"!text-white"}
            movingBg_style={"bg-linear_1"}
          />
        </div>
      </div>

      <div className="plans flex flex-col md:flex-row  justify-between items-center w-full lg:hidden gap-4  mt-6">
        {["Request", "Request Plus", "Request Full Plus"].map((plan, idx) => (
          <div
            key={idx}
            className={`flex flex-col bg-white rounded-3xl p-4 shadow-lg border-t-4 ${
              idx === 0
                ? "border-yellow-400"
                : idx === 1
                ? "border-green-400"
                : "border-purple-400"
            }`}
          >
            <h3 className="font-bold text-lg mb-2">{plan}</h3>
            <span className="text-gold font-bold text-sm mb-2">
              {t("14 day trial")}
            </span>
            <p className="flex items-center gap-1">
              <span className="text-purple text-2xl font-bold">
                {idx === 0 ? "8$" : idx === 1 ? "$16" : ""}
              </span>
              {idx === 2 ? (
                <span className="text-purple text-2xl font-bold">
                  {t("Custom")}
                </span>
              ) : (
                <span className="text-base font-normal">/{t("month")}</span>
              )}
            </p>
            <Link to={"/SignUp/ChooseRole"}>
              <Button className={"mt-4 !px-24"}>{t("Get started")}</Button>
            </Link>
          </div>
        ))}
      </div>

      <table
        className={`table w-full table-auto border-separate border-spacing-4 mt-8`}
      >
        <thead>
          <tr className=" my-2 hidden lg:table-row">
            <th></th>
            <th className="bg-white rounded-3xl p-4 shadow-lg  border-green-400">
              <div className="flex flex-col">
                <h3 className="font-bold text-lg mb-2 text-start">Request</h3>
                <span className="text-gold font-bold text-sm mb-2 text-start">
                  {t("14 day trial")}
                </span>
                <p className="flex items-center gap-1 text-start">
                  <span className="text-purple text-2xl font-bold">8$</span>
                  <span className="text-base font-normal">/{t("month")}</span>
                </p>
                <Link to={"/PlanDetails"}>
                  <Button className="mt-4 !px-24"> {t("Get Started")}</Button>
                </Link>
              </div>
            </th>
            <th className="bg-white rounded-3xl p-4 shadow-lg  border-green-400">
              <div className="flex flex-col">
                <h3 className="font-bold text-lg mb-2 text-start">
                  Request Plus
                </h3>
                <span className="text-gold font-bold text-sm mb-2 text-start">
                  {t("14 day trial")}
                </span>
                <p className="flex items-center gap-1 text-start">
                  <span className="text-purple text-2xl font-bold">16$</span>
                  <span className="text-base font-normal">/{t("month")}</span>
                </p>
                <Link to={"/PlanDetails"}>
                  <Button className="mt-4 !px-24"> {t("Get Started")}</Button>
                </Link>
              </div>
            </th>
            <th className="bg-white rounded-3xl p-4 shadow-lg  border-purple-400">
              <div className="flex flex-col">
                <h3 className="font-bold text-lg mb-2 text-start">
                  Request Full Plus
                </h3>
                <span className="text-gold font-bold text-sm mb-2 text-start">
                  {t("14 day trial")}
                </span>
                <p className="flex items-center gap-1">
                  <span className="text-purple text-2xl font-bold">Custom</span>
                </p>
                <Link to={"/PlanDetails"}>
                  <Button className="mt-4 !px-24"> {t("Get Started")}</Button>
                </Link>
              </div>
            </th>
          </tr>
          <tr>
            <th className="font-bold "></th>
            <th className="font-bold  text-center">{t("Request")}</th>
            <th className="font-bold text-center">{t("RequestPlus")}</th>
            <th className="font-bold text-center">{t("RequestPlusFull")}</th>
          </tr>
        </thead>

        <tbody>
          {tableData.map((section, secIdx) => (
            <>
              <tr key={`section-${secIdx}`}>
                <td
                  colSpan={4}
                  className="p-3 font-semibold text-lg bg-gray-200 "
                >
                  {section.section}
                </td>
              </tr>
              {section.features.map((feature, featureIndex) => (
                <tr key={`feature-${featureIndex}`}>
                  <td className={`border-b border-gray-300 p-2  `}>
                    {feature.name}
                  </td>
                  <td className="border-b border-gray-300 p-2   text-center">
                    {typeof feature.request === "boolean" ? (
                      feature.request ? (
                        <div className="flex justify-center items-center">
                          <FaCheckCircle className="text-green w-5 h-5 text-center" />
                        </div>
                      ) : (
                        "-"
                      )
                    ) : (
                      feature.request
                    )}
                  </td>
                  <td className="border-b border-gray-300 p-2 text-center ">
                    {typeof feature.requestPlus === "boolean" ? (
                      feature.requestPlus ? (
                        <div className="flex justify-center items-center">
                          <FaCheckCircle className="text-green w-5 h-5 text-center" />
                        </div>
                      ) : (
                        "-"
                      )
                    ) : (
                      feature.requestPlus
                    )}
                  </td>
                  <td className="border-b border-gray-300 text-center">
                    {typeof feature.fullPlus === "boolean" ? (
                      feature.fullPlus ? (
                        <div className="flex justify-center items-center">
                          <FaCheckCircle className="text-green w-5 h-5 text-center" />
                        </div>
                      ) : (
                        "-"
                      )
                    ) : (
                      feature.fullPlus
                    )}
                  </td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlansInfoLanding;

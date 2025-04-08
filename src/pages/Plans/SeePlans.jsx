import { MdCheckCircleOutline } from "react-icons/md";
import SwitchTabs from "../../Components/switchTabs/SwitchTabs";
import Button from "../../Components/UI/Button/Button";
import { FaXmark } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import "./style.scss";
import { Chip } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { t } from "i18next";
const tiers = [
  {
    name: "Request",
    id: "normal",
    href: "#",
    priceMonthly: "$8",
    description: t("Best for personal use"),
    features: [
      {
        feature: t("14 day trial"),
        accepted: true,
      },
      {
        feature: t("2 projects"),
        accepted: true,
      },
      {
        feature: t("Weekly report"),
        accepted: false,
      },
      {
        feature: t("certified extracts"),
        accepted: true,
      },
      {
        feature: t("3 accounts"),
        accepted: true,
      },
      {
        feature: t("15 Storage space"),
        accepted: true,
      },
      {
        feature: t("Mobile App Integration"),
        accepted: false,
      },
    ],
    featured: false,
  },
  {
    name: "Request Plus",
    id: "Plus",
    href: "#",
    priceMonthly: "$16",
    description: t("Best for personal use"),
    features: [
      {
        feature: t("14 day trial"),
        accepted: true,
      },
      {
        feature: t("5 projects"),
        accepted: true,
      },
      {
        feature: t("Weekly report"),
        accepted: true,
      },
      {
        feature: t("certified extracts"),
        accepted: false,
      },
      {
        feature: t("6 accounts"),
        accepted: true,
      },
      {
        feature: t("15 Storage space"),
        accepted: true,
      },
      {
        feature: t("Mobile App Integration"),
        accepted: true,
      },
    ],
    featured: true,
  },
  {
    name: "Request Full Plus",
    id: "FullPlus",
    href: "#",
    priceMonthly: "$99",
    description: t("Best for personal use"),
    features: [
      {
        feature: t("14 day trial"),
        accepted: true,
      },
      {
        feature: t("10 projects"),
        accepted: true,
      },
      {
        feature: t("Weekly report"),
        accepted: false,
      },
      {
        feature: t("certified extracts"),
        accepted: true,
      },
      {
        feature: t("9 accounts"),
        accepted: true,
      },
      {
        feature: t("15 Storage space"),
        accepted: true,
      },
      {
        feature: t("Mobile App Integration"),
        accepted: true,
      },
    ],
    featured: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SeePlans = () => {
  return (
    <div className="SeePlans flex flex-col items-center">
      <h1 className="text-xl  md:text-2xl ltr:lg:text-3xl rtl:lg:text-4xl font-extrabold">
        {t("Streamline your teamwork. Start free.")}
      </h1>
      <p className="font-normal text-sm md:text-base my-3">
        {t("Choose the perfect plan for your business needs")}
      </p>
      <div className="my-3 relative tooltip-container w-[8em] h-10">
        <div className="tooltip">
          <span className="text-white">{t("Save 20%")}</span>
        </div>
      </div>
      <SwitchTabs
        data={[t("Yearly"), t("Monthly")]}
        main_style={"bg-white"}
        activeTab_style={"!text-white"}
        movingBg_style={"bg-linear_1 "}
        //   tab_style={"!w-[150px]"}
        //   tab_moving={350}
      />

      <div className=" grid grid-cols-6 gap-3 ">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              "rounded-3xl col-span-6 md:col-span-3 lg:col-span-2  p-8 ring-1 ring-gray-900/10 sm:p-10 bg-white/60 border-t-4 ",
              tierIdx === 0
                ? "border-yellow  mt-10"
                : tierIdx === 1
                ? "border-green  mt-10"
                : "border-purple-dark  mt-10"
            )}
          >
            <h3
              id={tier.id}
              className={classNames("text-base font-semibold leading-7")}
            >
              {tier.name}
            </h3>
            <p className={classNames("mt-1 text-base leading-7")}>
              {tier.description}
            </p>
            <div className="flex items-center justify-between">
              <p className="mt-4 flex items-baseline gap-x-2">
                <span
                  className={classNames("text-5xl font-bold tracking-tight")}
                >
                  {tier.priceMonthly}
                </span>
                <span className={classNames("text-base")}>/{t("month")}</span>
              </p>
              {tier.featured && (
                <Chip
                  variant="soft"
                  size="small"
                  sx={{ ml: 2 }}
                  value={t("Most Popular")}
                  className="bg-green !rounded-3xl "
                />
              )}
            </div>

            <ul
              role="list"
              className={classNames(
                "mt-8 space-y-3 text-sm leading-6 sm:mt-10"
              )}
            >
              {tier.features.map((feature, index) => (
                <li
                  key={feature.feature}
                  className={classNames(
                    "font-medium leading-6 flex items-center  gap-2 "
                  )}
                >
                  <span>
                    {feature.accepted ? (
                      <FaCheck
                        style={{
                          color: "#1D4ED8",
                        }}
                      />
                    ) : (
                      <FaXmark className="text-red" />
                    )}
                  </span>
                  <span>{feature.feature}</span>
                </li>
              ))}
            </ul>
            <Link to={`/PlanDetails/${tier.name}`}>
              <Button className={"mt-4 font-normal text-xs px-0  lg:px-8"}>
                {t("Get Started")}
              </Button>
            </Link>
          </div>
        ))}
      </div>
      <Link
        to={"/PlansInfo"}
        className="text-gold underline underline-offset-1 relative my-4 z-50"
      >
        {t("More Details")}
      </Link>
    </div>
  );
};

export default SeePlans;

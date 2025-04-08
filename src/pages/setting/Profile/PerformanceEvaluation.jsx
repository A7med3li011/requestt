import { FcSimCardChip } from "react-icons/fc";
import { RiMastercardFill } from "react-icons/ri";
import { Progress } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoTrendingDownOutline, IoTrendingUpOutline } from "react-icons/io5";

const PerformanceEvaluation = () => {
  const ProjectsPerformanceOptions = {
    series: [44, 55, 67],
    chart: {
      height: 50,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: -180,
        endAngle: 90,
        hollow: {
          margin: 5,
          size: "50%",
          background: "transparent",
          image: undefined,
        },
        dataLabels: {
          name: {
            fontSize: "16px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: false,
          },
        },
        rounded: true,
      },
    },
    labels: ["Completed", "In-Progress", "Delayed"],
    colors: ["#81D4C2", "#FFB926", "#FF5630"],
  };

  const weeklyActivityOptions = {
    series: [
      {
        name: "Delayed",
        data: [80, 100, 150, 120, 90, 60, 100], // Example data for each day
      },
      {
        name: "InProgress",
        data: [200, 150, 100, 300, 200, 150, 80], // Example data for each day
      },
      {
        name: "Completed",
        data: [300, 400, 350, 450, 420, 430, 300], // Example data for each day
      },
    ],
    chart: {
      type: "bar",
      zoom: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    grid: {
      row: {
        colors: ["#fff", "#f2f2f2"],
      },
    },
    xaxis: {
      categories: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    },
    yaxis: {
      min: 0,
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
    colors: ["#ff6361", "#ffa600", "#3ac569"],
  };
  const MonthlyRevenueChart = {
    series: [
      {
        name: "Revenue",
        data: [
          12000, 15000, 11000, 22000, 28000, 24000, 20000, 25000, 30000, 21000,
          18000, 35000,
        ],
      },
    ],
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: {
        style: {
          colors: "#6B7280", 
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${value.toLocaleString()}`,
      },
     
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#8e44ad"], 
        inverseColors: true,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 100],
      },
    },
    colors: ["#8e44ad"],
  };

  
  return (
    <div className="PerformanceEvaluation p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card col-span-2">
          <div className="visa-card h-[200px] rounded-2xl bg-linear_1 p-3 text-white flex flex-col">
            <div className="header flex items-center justify-between p-1 md:p-2">
              <div className="flex flex-col">
                <span className="text-xs font-normal">{t("Balance")}</span>
                <span className="font-semibold text-xl">$5,756</span>
              </div>
              <span className="mx-2">
                <FcSimCardChip className="w-10 h-10 text-white" />
              </span>
            </div>
            <div className="content m-3 flex items-center justify-around">
              <div className="flex flex-col">
                <span className="text-xs font-normal">
                  {t("Card holder Name")}
                </span>
                <span className="font-semibold text-base">Eddy Cusuma</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-normal">{t("VALID THRU")}</span>
                <span className="font-semibold text-base">12/22</span>
              </div>
            </div>
            <div className="footer mt-5 mx-3 flex justify-between items-center">
              <p>3778 **** **** 1234</p>
              <span>
                <RiMastercardFill className="w-10 h-10" />
              </span>
            </div>
          </div>
        </div>

        <div className="PackageShippingMovement col-span-2">
          <p className="font-medium text-sm mb-2">
            {t("Package shipping movement")}
          </p>
          <div className="card h-[170px] bg-white rounded-2xl overflow-y-scroll overflow-x-hidden">
            <table className="w-full text-left p-4">
              <thead>
                <tr>
                  <th className="border-b text-gray font-medium text-sm p-1 md:p-2"></th>
                  <th className="border-b text-gray font-medium text-sm p-1 md:p-2">
                    {t("Date")}
                  </th>
                  <th className="border-b text-gray font-medium text-sm p-1 md:p-2">
                    {t("Name")}
                  </th>
                  <th className="border-b text-gray font-medium text-sm p-1 md:p-2">
                    {t("Price")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array(5)
                  .fill(0)
                  .map((_, idx) => (
                    <tr key={idx} className="hover:bg-gray-100">
                      <td className="p-1 md:p-2" style={{ color: "#2566AF" }}>
                        VISA
                      </td>
                      <td className="p-1 md:p-2">12-1-2024</td>
                      <td className="p-1 md:p-2">Request</td>
                      <td className="p-1 md:p-2">$8</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-3">
        <div className="activeProjects col-span-2">
          <p className="font-medium text-base">{t("ActiveProjects")}</p>
          <table className="w-full table-auto bg-white rounded-2xl overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="border-b font-medium text-sm p-1 md:p-2">
                  {t("Project Name")}
                </th>
                <th className="border-b font-medium text-sm p-1 md:p-2">
                  {t("Tasks")}
                </th>
                <th className="border-b font-medium text-sm p-1 md:p-2">
                  {t("Progress")}
                </th>
                <th className="border-b font-medium text-sm p-1 md:p-2">
                  {t("Members")}
                </th>
              </tr>
            </thead>
            <tbody>
              {Array(5)
                .fill(0)
                .map((_, idx) => (
                  <tr key={idx} className="hover:bg-gray-100">
                    <td className="p-1 md:p-2 text-xs md:text-base">
                      {t("Project Name")} {idx + 1}
                    </td>
                    <td className="p-1 md:p-2">
                      134 <span className="hidden md:block"> {t("Tasks")}</span>
                    </td>
                    <td className="p-1 md:p-2 flex items-center gap-1">
                      <span className="font-inter  text-xs text-gray-dark ">
                        15%
                      </span>
                      <Progress
                        value={70}
                        color="purple"
                        size="sm"
                        className="w-full"
                        barProps={{
                          style: {
                            height: "5px",
                            backgroundColor: "var(--purple)",
                          },
                        }}
                        style={{
                          backgroundColor: "#e0e0e0",
                          borderRadius: "5px",
                        }}
                      />
                    </td>
                    <td className="p-1 md:p-2">
                      <div className="flex -space-x-2">
                        {Array(3)
                          .fill(0)
                          .map((_, i) => (
                            <img
                              key={i}
                              src={`https://i.pravatar.cc/40?img=${i}`}
                              alt="member"
                              className="w-5 h-5 md:w-8 md:h-8 rounded-full border-2 border-white"
                            />
                          ))}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white p-4 shadow-lg rounded-lg col-span-2">
          <h3 className="font-semibold mb-2">{t("ProjectsPerformance")}</h3>
          <div className="flex flex-col">
            <Chart
              options={SettingOptions}
              series={SettingOptions.series}
              type="radialBar"
              height={180}
            />
            <div className="flex items-center justify-center gap-5 mt-2">
              <div className="Completed flex flex-col items-center">
                <span>
                  <IoMdCheckmarkCircleOutline
                    className="w-5 h-5"
                    style={{
                      color: "#81D4C2",
                    }}
                  />
                </span>
                <span className="font-semibold text-lg">44%</span>
                <span className="font-medium text-base">{t("completed")}</span>
              </div>
              <div className="In-Progress flex flex-col items-center">
                <span>
                  <IoTrendingUpOutline
                    className="w-5 h-5"
                    style={{
                      color: "#FFB926",
                    }}
                  />
                </span>
                <span className="font-semibold text-lg">55%</span>
                <span className="font-medium text-base">{t("inProgress")}</span>
              </div>
              <div className="Delayed flex flex-col items-center">
                <span>
                  <IoTrendingDownOutline
                    className="w-5 h-5"
                    style={{
                      color: "#FF5630",
                    }}
                  />
                </span>
                <span className="font-semibold text-lg">67%</span>
                <span className="font-medium text-base">{t("delayed")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 my-3">
        <div className="weeklyActivity col-span-2 bg-white rounded-2xl  shadow-md p-1 md:p-2">
          <span className="mx-2">{t("Weekly Activity")}</span>
          <Chart
            options={weeklyActivityOptions}
            series={weeklyActivityOptions.series}
            type="bar"
            height={250}
          />
        </div>
        <div className="weeklyActivity col-span-2 bg-white rounded-2xl  shadow-md p-1 md:p-2">
          <span className="mx-2">{t("Monthly Revenue")}</span>
          <Chart
            options={MonthlyRevenueChart}
            series={MonthlyRevenueChart.series}
            type="line"
            height={250}
          />
        </div>
      </div>
    </div>
  );
};

export default PerformanceEvaluation;

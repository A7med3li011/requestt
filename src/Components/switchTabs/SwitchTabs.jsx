import React, { useEffect, useState } from "react";
import "./style.scss";
import { useLanguage } from "../../context/LanguageContext";

const SwitchTabs = ({
  data,
  onTabChange,
  movingBg_style,
  main_style,
  activeTab_style,
  tab_style,
  Tab,
}) => {
  const [selectedTab, setSelectedTab] = useState(Tab);
  const [activePosition, setActivePosition] = useState(0);
  const { isRTL } = useLanguage();

  useEffect(() => {
    setSelectedTab(Tab);
    updateActivePosition(Tab);
  }, [Tab]);

  const updateActivePosition = (index) => {
    const tabWidth = document.querySelector(".tabItem")?.offsetWidth || 200;
    setActivePosition(index * tabWidth);
  };

  const activeTab = (tab, index) => {
    updateActivePosition(index);
    setTimeout(() => {
      setSelectedTab(index);
    }, 300);
    onTabChange(tab, index);
  };

  return (
    <div className={`switchingTabs ${main_style} p-1`}>
      <div className="tabItems  flex justify-around items-center relative">
        {data.map((tab, index) => (
          <span
            key={index}
            className={`tabItem ${tab_style} py-1 text-center rounded-md my-1 cursor-pointer ${
              selectedTab === index ? `activeTabItem ${activeTab_style}` : ""
            }`}
            onClick={() => activeTab(tab, index)}
          >
            {tab}
          </span>
        ))}
        <span
          className={`movingBg ${movingBg_style}`}
          style={{
            width: `calc(100% / ${data.length})`,
            ...(isRTL
              ? { right: `${activePosition}px` }
              : { left: `${activePosition}px` }),
          }}
        />
      </div>
    </div>
  );
};

export default SwitchTabs;

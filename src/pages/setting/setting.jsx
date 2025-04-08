import React, { useEffect, useRef, useState } from "react";
import Button from "../../Components/UI/Button/Button";
import General from "./General/General";
import Company from "./company/Company";
import Security from "./security/Security";
import Profile from "./Profile/Profile";
import CreateTag from "./Tags/CreateTag";
import "./style.scss";
import SwitchTabs from "../../Components/switchTabs/SwitchTabs";
import { addTag, addVocation } from "../../Services/api";
import { toast } from "react-toastify";
import i18next, { t } from "i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { Drawer } from "@material-tailwind/react";
import CreateVocation from "./Vocation/CreateVocation";

//  check input
export function CheckInput({ checked, onChange }) {
  return (
    <div className="toggle">
      <label className="label">
        <input
          className="toggle-state"
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <div className="toggle">
          <div className="indicator"></div>
        </div>
      </label>
    </div>
  );
}

// Debounce utility function
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

const Setting = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [selectedTab, setSelectedTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState([]);
  // const [Vocations, seVocations] = useState([]);
  const profileRef = useRef();
  const generalRef = useRef();
  const lang = i18next.language;

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  useEffect(() => {
    if (location.state && location.state.tabIndex !== undefined) {
      setSelectedTab(location.state.tabIndex);
    }
  }, [location.state]);

  const saveGeneralChanges = () => {
    if (generalRef.current) {
      const settings = generalRef.current.handleSave();
      "General Settings Saved:", settings;
      toast.success(t("toast.GeneralSettingSuccess"));
    }
  };

  const saveProfileChanges = () => {
    if (profileRef.current) {
      profileRef.current.handleUpdate();
    }
  };

  const saveCompanyChanges = () => {
    ("Saving Company Settings...");
  };

  const saveSecurityChanges = () => {
    ("Saving Security Settings...");
  };
  const saveVocationChanges = () => {
    ("Saving Vocation Settings...");
  };

  const handleSaveChanges = () => {
    const currentTab = buttons[selectedTab];
    currentTab.handleSave();
  };
  const saveCreateTagChanges = async () => {
    try {
      const savePromises = tags.map(async (tag) => {
        try {
          tag, user._id, lang;

          const response = await addTag(tag, user._id, lang);
          `Tag added successfully:`, response;

          return response;
        } catch (error) {
          console.error(`Error adding tag: ${tag.name}`, error);
          throw error;
        }
      });

      const results = await Promise.all(savePromises);
      window.location.reload();
      toast.success(t("toast.TagsCreatedSuccess"));

      "All tags saved successfully:", results;
    } catch (error) {
      console.error("Error saving tags:", error);
    }
  };

  const debouncedSaveCreateTagChanges = debounce(saveCreateTagChanges, 1000);

  // const saveCreateVocationChanges = async () => {
  //   try {
  //     ("Saving all added Vocations:", Vocations);

  //     const savePromises = Vocations.map(async (voc) => {
  //       try {
  //         const payload = {
  //           name: voc.name,
  //           createdBy: user._id,
  //         };
  //         ("Sending voc to API:", payload);
  //         const response = await addVocation(token, payload, lang);
  //         (`voc added successfully:`, response);

  //         return response;
  //       } catch (error) {
  //         console.error(`Error adding tag: ${voc.name}`, error);
  //         throw error;
  //       }
  //     });

  //     const results = await Promise.all(savePromises);
  //     // window.location.reload();
  //     toast.success(t("toast.VocCreatedSuccess"));

  //     ("All vocations saved successfully:", results);
  //   } catch (error) {
  //     console.error("Error saving tags:", error);
  //   }
  // };
  const handleTagsChange = (updatedTags) => {
    setTags(updatedTags);
  };

  // const handleVocationsChange = (updatedVocations) => {
  //   seVocations(updatedVocations);
  //   ("Vocations:", updatedVocations);
  // };

  const buttons = [
    {
      label: t("General"),
      value: "General",
      component: <General ref={generalRef} />,
      handleSave: saveGeneralChanges,
    },
    {
      label: t("Personal Profile"),
      value: "Profile",
      component: (
        <Profile ref={profileRef} onProfileUpdate={saveProfileChanges} />
      ),
      handleSave: saveProfileChanges,
    },
    {
      label: t("Company Information"),
      value: "Company",
      component: <Company />,
      handleSave: saveCompanyChanges,
    },
    {
      label: t("Access & Security"),
      value: "Security",
      component: <Security />,
      handleSave: saveSecurityChanges,
    },
    {
      label: t("createTag"),
      value: "CreateTags",
      component: <CreateTag onTagsChange={handleTagsChange} />,
      handleSave: debouncedSaveCreateTagChanges,
    },
    {
      label: t("createVocation"),
      value: "createVocation",
      component: <CreateVocation />,
      handleSave: saveVocationChanges,
    },
  ];

  const handleTabChange = (tab, index) => {
    setSelectedTab(index);
  };

    console.log(buttons[selectedTab].label)
  return (
    <div className="Settings">
      <div className="wrapper bg-white rounded-xl p-4 mx-auto   lg:max-w-2xl ">
        <div className="head flex justify-between items-center">
          <p className="font-semibold text-base">
            {buttons[selectedTab].label}
          </p>
          <div className="saveChanges hidden lg:block">
            {buttons[selectedTab].label != "Company Information"&&<Button
              className={"!px-12 font-medium"}
              onClick={handleSaveChanges}
            >
              {t("Save Changes")}
            </Button>}
          </div>
          <div className="mobile_menu block lg:hidden">
            <button onClick={openDrawer}>
              <span>
                <FaBars className="text-purple w-5 h-5" />
              </span>
            </button>
            <Drawer open={open} onClose={closeDrawer} className="p-4">
              <h2 className="text-xl font-semibold text-purple">
                {t("settings")}
              </h2>
              <div className="divider h-px w-full bg-gray my-2"></div>
              <div className="flex flex-col justify-start items-start gap-3">
                {buttons.map((button, index) => (
                  <button
                    key={index}
                    className={`text-gray hover:text-purple my-2  font-medium ${
                      button.value === buttons[selectedTab].value
                        ? "text-purple"
                        : ""
                    }`}
                    onClick={() =>
                      handleTabChange(button, buttons.indexOf(button))
                    }
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </Drawer>
          </div>
        </div>
        <div className="divider h-px w-full bg-gray my-2"></div>
        <div className="switchTabs  my-2 hidden text-sm lg:block">
          <SwitchTabs
            data={buttons.map((button) => button.label)}
            onTabChange={handleTabChange}
            Tab={selectedTab}
            movingBg_style={`!w-[110px]`}
            tab_style={`!w-[110px] `}
          />
        </div>
        <div className="content mt-4">{buttons[selectedTab].component}</div>
      </div>
      <div className="saveChanges_mobile  lg:hidden   flex items-center justify-center my-3">
        <Button className={"font-medium"} onClick={handleSaveChanges}>
          {t("Save Changes")}
        </Button>
      </div>
    </div>
  );
};

export default Setting;

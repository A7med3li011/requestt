import React, { useEffect, useState } from "react";
import { hsvaToHex } from "@uiw/color-convert";
import Swatch from "@uiw/react-color-swatch";
import { t } from "i18next";
import Input from "../../../Components/UI/Input/Input";
import Button from "../../../Components/UI/Button/Button";
import Loader from "../../../Components/Loader/Loader";
import { getAllTagsByUser } from "../../../Services/api";
import "./style.scss";
import { PlayIcon } from "../../../Components/UI/checkMark/Playbtn";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function Point({ checked }) {
  if (!checked) return null;

  return (
    <div
      style={{
        height: 40,
        width: 40,
        position: "absolute",
        top: 20,
        left: 20,
        borderRadius: "50%",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.5,
        filter: `brightness(${checked ? 1 : 0.5})`,
        transform: "translate(-50%, -50%)",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {checked ? <PlayIcon color={"white"} /> : null}
    </div>
  );
}

function SwatchComponent({ color, onChange }) {
  return (
    <Swatch
      colors={[
        "#C781AB",
        "#D8AEFF",
        "#EBD5E2",
        "#F47799",
        "#F3B0C2",
        "#FFACED",
        "#FCD1FA",
        "#68C9DA",
        "#ACDEE7",
        "#96CD94",
        "#CCE2CB",
        "#ABFFC2",
        "#F4D674",
        "#F6EAC2",
        "#FBFB6F",
        "#FFFFB5",
        "#73A8FF",
        "#A2CAFC",
      ]}
      color={color}
      rectProps={{
        style: { minWidth: "40px", minHeight: "40px", borderRadius: "50%" },
        children: <Point checked={true} />,
        className: "col-span-1 ",
      }}
      className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
      onChange={(hsvColor) => onChange(hsvaToHex(hsvColor))}
    />
  );
}

const CreateTag = ({ onTagsChange }) => {
  const user = useSelector((state) => state.auth.user);
  const userId = user._id;
  const [color, setColor] = useState("#73A8FF");
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [newTags, setNewTags] = useState([]);
  const [newTagName, setNewTagName] = useState("");

  useEffect(() => {
    const getTags = async () => {
      setLoading(true);
      try {
        const result = await getAllTagsByUser(userId);
        setTags(result.results);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };
    getTags();
  }, [userId]);

  const handleAddTag = (e) => {
    e.preventDefault();
    const trimmedTagName = newTagName.trim();
    if (trimmedTagName === "") {
      toast.error(t("Tag name cannot be empty"));
      return;
    }

    const TagData = { name: trimmedTagName, colorCode: color };

    const updatedTags = [...tags, TagData];
    setTags(updatedTags);
    setNewTags([...newTags, TagData]); // Add to newTags
    onTagsChange(updatedTags);
    setNewTagName(""); // Clear input after adding the tag
  };

  const handleDeleteTag = (tagToDelete) => {
    const updatedTags = tags.filter((tag) => tag !== tagToDelete);
    const updatedNewTags = newTags.filter((tag) => tag !== tagToDelete);

    setTags(updatedTags);
    setNewTags(updatedNewTags); // Update newTags
    onTagsChange(updatedTags);
  };

  return (
    <div className="CreateTag">
      {loading ? (
        <div className="loader flex items-center justify-center m-auto">
          <Loader />
        </div>
      ) : (
        <div className="wrapper bg-white rounded-3xl p-3 m-2">
          <h6 className="font-semibold text-sm leading-4">{t("Tags")}</h6>
          {tags.length > 0 ? (
            <div className="PreviousTags  flex flex-wrap bg-white rounded-3xl p-4 shadow-lg">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className={`tag col-span-1 rounded-3xl p-1 px-3 py-2 text-center relative`}
                  style={{
                    background: `${tag.colorCode}30`, // Opacity 25%
                    color: "black",
                  }}
                >
                  {tag.name}
                  {newTags.includes(tag) && (
                    <button
                      className="absolute rounded-full bg-white w-6 -top-3 right-2"
                      onClick={() => handleDeleteTag(tag)}
                      style={{
                        color: tag.colorCode,
                      }}
                    >
                      <span className="w-4  font-semibold text-sm">
                        &#x2715;
                      </span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-sm leading-4 text-gray-600">
              {t("No Previous tags")}
            </div>
          )}

          
          <form onSubmit={handleAddTag} className="py-5 px-3 lg:px-8">
            <Input
              label={t("TName")}
              placeholder={t("TName")}
              className="bg-white border border-purple mx-2 border-solid focus:border focus:border-purple focus:border-solid"
              type="text"
              required={true}
              id="name"
              autoComplete="off"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
            />
            <div className="mt-4 ">
              <SwatchComponent color={color} onChange={setColor} />
            </div>

            <input type="hidden" name="color" value={color} />

            <div className="btn flex items-center justify-center md:justify-end m-4 ">
              <Button className={"!font-bold text-base !px-10"} type="submit">
                {t("+ Add new tag")}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateTag;

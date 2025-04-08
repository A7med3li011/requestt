import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import Swatch from "@uiw/react-color-swatch";
import SignaturePad from "react-signature-canvas";
import { hsvaToHex } from "@uiw/color-convert";
import React, { useRef, useState, useEffect } from "react";
import { CgImage } from "react-icons/cg";
import { FaSignature, FaEdit } from "react-icons/fa";
import { PiSignatureBold } from "react-icons/pi";
import { RiCloseCircleLine, RiDeleteBinLine } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";
import "./style.scss";
import { MdOutlinePanoramaHorizontal } from "react-icons/md";
import { t } from "i18next";
import axios from "axios";
import { useSelector } from "react-redux";

// Point component for swatch
function Point({ color, checked }) {
  if (!checked) return null;
  return (
    <div
      style={{
        height: 24,
        width: 24,
        borderRadius: "4px",
        backgroundColor: color,
      }}
    ></div>
  );
}

// Swatch component to choose colors
function SwatchComponent({ color, onChange }) {
  return (
    <Swatch
      colors={["#1300EE", "#B10F03", "#606C80", "#000"]}
      color={color}
      rectProps={{
        children: <Point color={color} checked={color === color} />,
        style: {
          width: 24,
          height: 24,
          borderRadius: "4px",
        },
      }}
      onChange={(hsvColor) => {
        const hexColor = hsvaToHex(hsvColor);
        onChange(hexColor);
      }}
    />
  );
}

// Signature Button Component
export function SignatureBtn({ onSignatureChange, company }) {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState("#000");
  const [fontWeight, setFontWeight] = useState("normal");
  const [activeWeight, setActiveWeight] = useState("normal");
  const [isDrawnSignature, setIsDrawnSignature] = useState(true);
  const [preview, setPreview] = useState(null);
  const signaturePadRef = useRef(null);
  const user = useSelector((state) => state.auth.user);

  // Load saved signature from local storage
  useEffect(() => {
    if (open && signaturePadRef.current && isDrawnSignature) {
      const savedSignature = localStorage.getItem("Signature");
      // if (savedSignature) {
      //   signaturePadRef.current.fromDataURL(savedSignature);
      // }
    }
  }, [open, isDrawnSignature]);

  // Function to handle clear
  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setPreview(null);
      localStorage.removeItem("Signature");
    }
  };

  // Function to handle opening and closing the dialog
  const handleOpen = () => {
    setOpen(!open);
  };

  // Function to change font weight
  const handleFontWeightChange = (weight) => {
    setFontWeight(weight);
    setActiveWeight(weight);
  };

  // Handle signature edit - load the saved signature back into the pad
  const handleEdit = (e) => {
    e.preventDefault();
    handleOpen();
    if (signaturePadRef.current) {
      const savedSignature = localStorage.getItem("Signature");
      if (savedSignature) {
        const img = new Image();
        img.src = savedSignature;
        img.onload = () => {
          signaturePadRef.current.clear();
          signaturePadRef.current.fromDataURL(savedSignature);
        };
        img.onerror = (e) => {
          console.error("Error loading image:", e);
        };
      }
    }
  };

  const handleSaveSignature = () => {
    if (signaturePadRef.current) {
      console.log(signaturePadRef.current)
      const trimmedCanvas = signaturePadRef.current.getTrimmedCanvas();
      trimmedCanvas;
      const dataUrl = trimmedCanvas.toDataURL("image/png");
      setPreview(dataUrl);
      localStorage.setItem("Signature", dataUrl);

      if (onSignatureChange) {
        onSignatureChange(dataUrl); // Pass back to parent
      }

      handleOpen(); // Close the dialog after saving
    } else {
      toast.error("Please draw your signature first.");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = () => {
    //     setPreview(reader.result);
    //     setIsDrawnSignature(false);
    //     localStorage.setItem("Signature", reader.result);
    //     if (onSignatureChange) {
    //       onSignatureChange(reader.result);
    //     }
    //   };
    //   reader.readAsDataURL(file);
    // }
    if (file) {
      const formData = new FormData();
      formData.append("signature", file);
      await axios.put(
        `https://api.request-sa.com/api/v1/users/company/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      ).then(res=>console.log(res)).catch(err=>console.log(err));
    }
    // console.log(file);
    setOpen(false);
  };

  const handleDeleteImageUpload = () => {
    setPreview(null);
    setIsDrawnSignature(true);
    localStorage.removeItem("Signature");
  };

  const getStrokeSettings = () => {
    switch (fontWeight) {
      case "lighter":
        return { dotSize: 0.5, minWidth: 1, maxWidth: 2 };
      case "normal":
        return { dotSize: 1, minWidth: 2, maxWidth: 4 };
      case "bold":
        return { dotSize: 6, minWidth: 3, maxWidth: 9 };
      default:
        return { dotSize: 1, minWidth: 2, maxWidth: 4 };
    }
  };

  const strokeSettings = getStrokeSettings();

  const signatureOptions = {
    dotSize: strokeSettings.dotSize,
    velocityFilterWeight: 0.7,
    minWidth: strokeSettings.minWidth,
    maxWidth: strokeSettings.maxWidth,
    minDistance: 5,
    penColor: color,
    throttle: 16,
    clearOnResize: true,
    backgroundColor: "#fff",
    onBegin: () => "Stroke began",
    onEnd: () => "Stroke ended",
  };


  
  
  
  return (
    <>
      <div
        onClick={handleOpen}
        className="box flex justify-between items-center bg-white py-2 px-6 gap-2 rounded-2xl m-2 shadow-md cursor-pointer"
      >
      
        <div className="flex justify-start items-center">
          <span
            className="icon_wrapper rounded-2xl p-5 my-2 mx-4"
            style={{ background: "#CCABDA33" }}
          >
            <PiSignatureBold className="text-purple w-6 h-6" />
          </span>
          {company?.signature ? (
            <img
              className="w-[66px] h-[62px] object-contain"
              src={`https://api.request-sa.com/${company.signature}`}
              alt="Signature"
            />
          ) : (
            <span className="font-workSans font-semibold text-xl leading-5">
              {t("Signature")}
            </span>
          )}
        </div>
        <div className="Signature_fun">
          {preview && (
            <div className="flex items-center justify-between gap-4">
              <button className="clear" onClick={handleDeleteImageUpload}>
                <RiDeleteBinLine className="text-red w-5 h-5" />
              </button>
              <button onClick={handleEdit}>
                <FaEdit className="text-purple w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={open} handler={handleOpen}>
        <DialogHeader className="flex items-center justify-center relative">
          <button
            className="clear block absolute left-4 top-4 md:hidden"
            onClick={handleClear}
          >
            <RiDeleteBinLine className="text-red w-5 h-5" />
          </button>
          <div className="flex items-center justify-between gap-7">
            <label
              htmlFor="signature"
              className="text-gray flex items-center gap-2 font-workSans font-semibold text-base cursor-pointer"
            >
              <CgImage className="text-gray w-5 h-5" /> Image
            </label>
            <input
              type="file"
              name="signature"
              id="signature"
              className="hidden"
              onChange={handleImageUpload}
            />
            <p className="text-purple flex items-center gap-2 font-workSans font-semibold text-base">
              <FaSignature className="text-purple w-5 h-5" /> Draw
            </p>
          </div>
          <button onClick={handleOpen}>
            <RiCloseCircleLine className="text-red absolute right-4 top-4 cursor-pointer" />
          </button>
        </DialogHeader>
        <DialogBody>
          <SignaturePad
            ref={signaturePadRef}
            penColor={color}
            backgroundColor="rgba(255,255,255,1)"
            canvasProps={{
              style: {
                width: "100%",
                maxWidth: "600px",
                minHeight: "200px",
                height: "100%",
              },
            }}
            {...signatureOptions}
          />
        </DialogBody>
        <DialogFooter className="flex items-center justify-between gap-3 ">
          <button className="clear hidden md:block" onClick={handleClear}>
            <RiDeleteBinLine className="text-red w-5 h-5" />
          </button>
          <div className="Select_color ">
            <SwatchComponent color={color} onChange={setColor} />
            <input type="hidden" name="color" value={color} />
          </div>
          <div className="Select_font flex items-center gap-2 md:gap-3 cursor-pointer">
            <button
              onClick={() => handleFontWeightChange("lighter")}
              className={`${activeWeight === "lighter" ? "text-purple" : ""}`}
            >
              <FaSignature className="w-5 h-5 font-light" />
            </button>
            <button
              onClick={() => handleFontWeightChange("normal")}
              className={`${activeWeight === "normal" ? "text-purple" : ""}`}
            >
              <FaSignature className="w-5 h-5 font-medium" />
            </button>
            <button
              onClick={() => handleFontWeightChange("bold")}
              className={`${activeWeight === "bold" ? "text-purple" : ""}`}
            >
              <FaSignature className="w-5 h-5 font-extrabold" />
            </button>
          </div>
          <button
            className="save bg-linear_1 text-white px-4 py-2 rounded-md"
            onClick={handleSaveSignature}
          >
            Save
          </button>
        </DialogFooter>
        <span className="block md:hidden  text-sm text-center font-medium text-red m-2">
          it`s recommended to use this feature while rotating your phone
        </span>
      </Dialog>
    </>
  );
}

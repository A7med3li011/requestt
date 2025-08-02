import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function PreventAction({ children }) {
  const user = useSelector((state) => state.auth.user);
  const [authChecked, setAuthChecked] = useState(false);
  const [hasLogo, setHasLogo] = useState(false);
 
  useEffect(() => {
    if (!user?._id) return;

    async function getCompanyInfo() {
      try {
        const res = await axios.get(
          `https://api.request-sa.com/api/v1/users/companyDetails/${user._id}`
        );
        const companyData = res?.data?.results;
        if (
          companyData?.companyName &&
          companyData?.companyLogo &&
          companyData?.signature &&
          companyData?.electronicStamp
        ) {
          setHasLogo(true);
        } else {
          toast.warning("Please fill your company information first");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setAuthChecked(true);
      }
    }

    getCompanyInfo();
  }, [user?._id]);

  if (!authChecked) return null; // or a loading spinner

  if (!hasLogo) {
    return <Navigate to="/Settings" replace state={{ value: 2 }} />;
  }

  return children;
}

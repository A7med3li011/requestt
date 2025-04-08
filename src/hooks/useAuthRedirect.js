import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    ("User:", user); // Check if user exists
    ("Token:", token); // Check if token exists

    if (!user || !token) {
      ("Redirecting to /LogIn/Mail"); // Debugging log
      navigate("/LogIn/Mail");
    }
  }, [navigate]);
};

export default useAuthRedirect;

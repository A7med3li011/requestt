import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds
    console.log(decoded.exp < currentTime)
    return decoded.exp < currentTime;
  } catch (error) {
    return true; // If decoding fails, treat as expired
  }
}

const ProtectedRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();

  // If not authenticated or token is expired
  const tokenExpired = isTokenExpired(auth.token);
  if (!auth.isAuthenticated || tokenExpired) {
    // Remove token and user from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;

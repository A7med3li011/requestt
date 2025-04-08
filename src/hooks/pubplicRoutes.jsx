import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    // Redirect to home if already authenticated
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useLoggedInUser from "../../hooks/useLoggedInUser";

type roles = "user" | "owner" | "admin" | "delivery";

interface ProtectedRouteProps {
  allowto: roles[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowto }) => {
  const { user, loading } = useLoggedInUser();

  if ((!user || !allowto.includes(user.role)) && !loading) {
    return <Navigate to="/no-permissions" replace />;
  }
  if (user._id && !loading) {
    return <Outlet />;
  }
};

export default ProtectedRoute;

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import { UserRolesType } from "../../interfaces/interfaces";


interface ProtectedRouteProps {
  allowto: UserRolesType[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowto }) => {
  const { user, loading } = useLoggedInUser();

  if ((!user || !allowto.includes(user.role as UserRolesType)) && !loading) {
    return <Navigate to="/no-permissions" replace />;
  }
  if (user._id && !loading) {
    return <Outlet />;
  }
};

export default ProtectedRoute;

import { Navigate, Outlet } from "react-router-dom";
import useLoggedInUser from "../../hooks/useLoggedInUser";

const IsAuth = () => {
  const { user, loading } = useLoggedInUser();

  if ((!user || !user._id) && !loading) {
    return <Navigate to="/auth?login=true" replace />;
  }
  if (user._id && !loading) {
    return <Outlet />;
  }
};

export default IsAuth;

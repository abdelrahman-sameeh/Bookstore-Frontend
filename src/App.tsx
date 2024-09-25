import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { themeState } from "./recoil/utils";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/MainLayout/Home";
import MainLayout from "./layout/MainLayout";
import DashboardLayout from "./layout/DashboardLayout";
import RegisterLoginPage from "./pages/MainLayout/Auth/RegisterLoginPage";
import ForgetPasswordResetCode from "./pages/MainLayout/Auth/ForgetPasswordResetCode";
import VerifyResetCode from "./pages/MainLayout/Auth/VerifyResetCode";
import ChangePassword from "./pages/DashboardLayout/Auth/ChangePassword";
import Onboarding from "./pages/DashboardLayout/Owner/Onboarding";
import ProtectedRoutes from "./auth/guards/ProtectedRoute";
import IsAuth from "./auth/guards/IsAuth";
import NoPermission from "./auth/utils/NoPermission";
import ExploreBooks from "./pages/MainLayout/ExploreBooks";
import OwnerBooks from "./pages/DashboardLayout/Owner/OwnerBooks";

const App: React.FC = () => {
  const theme = useRecoilValue(themeState);

  useEffect(() => {
    document.body.className = theme === "light" ? "light-mode" : "dark-mode";
  }, [theme]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="no-permissions" element={<NoPermission />} />
          <Route path="auth" element={<RegisterLoginPage />} />
          <Route path="reset-code" element={<ForgetPasswordResetCode />} />
          <Route path="verify-reset-code" element={<VerifyResetCode />} />
          <Route path="books" element={<ExploreBooks />} />
        </Route>

        <Route element={<IsAuth />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="change-password" element={<ChangePassword />} />

            {/* owner routes */}
            <Route
              path="owner"
              element={<ProtectedRoutes allowto={["owner"]} />}
            >
              <Route path="onboarding" element={<Onboarding />} />
              <Route path="books" element={<OwnerBooks />} />
            </Route>
            {/* user routes */}
            <Route
              path="user"
              element={<ProtectedRoutes allowto={["user"]} />}
            ></Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

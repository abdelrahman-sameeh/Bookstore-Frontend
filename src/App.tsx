import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { themeState } from "./recoil/atoms";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/MainLayout/Home";
import MainLayout from "./layout/MainLayout";
import DashboardLayout from "./layout/DashboardLayout";
import RegisterLoginPage from "./pages/MainLayout/Auth/RegisterLoginPage";
import ForgetPasswordResetCode from "./pages/MainLayout/Auth/ForgetPasswordResetCode";
import VerifyResetCode from "./pages/MainLayout/Auth/VerifyResetCode";
import ChangePassword  from "./pages/DashboardLayout/Auth/ChangePassword";

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
          <Route path="auth" element={<RegisterLoginPage />} />
          <Route path="reset-code" element={<ForgetPasswordResetCode />} />
          <Route path="verify-reset-code" element={<VerifyResetCode />} />
        </Route>

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="change-password" element={<ChangePassword />} />

        </Route>

      </Routes>
    </Router>
  );
};

export default App;

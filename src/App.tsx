import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { themeState } from "./recoil/atoms";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import Navbar from "./components/utils/Navbar";
import RegisterLoginPage from "./pages/Auth/RegisterLoginPage";
import ForgetPasswordResetCode from "./pages/Auth/ForgetPasswordResetCode";
import VerifyResetCode from "./pages/Auth/VerifyResetCode";

const App: React.FC = () => {
  const theme = useRecoilValue(themeState);

  useEffect(() => {
    document.body.className = theme === "light" ? "light-mode" : "dark-mode";
  }, [theme]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<RegisterLoginPage />} />
        <Route path="/reset-code" element={<ForgetPasswordResetCode />} />
        <Route path="/verify-reset-code" element={<VerifyResetCode />} />
      </Routes>
    </Router>
  );
};

export default App;

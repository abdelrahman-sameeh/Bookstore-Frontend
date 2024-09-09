import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { themeState } from "./recoil/atoms";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import Navbar from "./components/utils/Navbar";
import RegisterLoginPage from "./pages/Auth/RegisterLoginPage";

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
        
      </Routes>
    </Router>
  );
};

export default App;

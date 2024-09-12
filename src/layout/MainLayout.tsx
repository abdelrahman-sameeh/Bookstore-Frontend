import { Outlet } from "react-router-dom";
import MainNavbarApp from "../components/utils/MainNavbar";

const MainLayout = () => {
  return (
    <div>
      <MainNavbarApp />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

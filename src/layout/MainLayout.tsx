import { Outlet } from "react-router-dom";
import MainNavbarApp from "../components/navbar/MainNavbar";

const MainLayout = () => {
  return (
    <div>
      <MainNavbarApp />
      <main className="mt-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

import { Outlet } from "react-router-dom";
import MainNavbarApp from "../components/navbar/MainNavbar";
import Footer from "../components/footer/Footer";

const MainLayout = () => {
  return (
    <div>
      <MainNavbarApp />
      <main className="mt-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "../../static/images/logo.png";
import { useTranslation } from "react-i18next";
import Icon from "./Icon";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { isLoginPageAtom } from "../../recoil/utils";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import { Dropdown } from "react-bootstrap";
import { UserRolesType } from "../../interfaces/interfaces";

const getNavigationPath = (role: UserRolesType) => {
  switch (role) {
    case "user":
      return "/dashboard/user/addresses";
    case "owner":
      return "/dashboard/owner/onboarding";
    case "admin":
      return "/dashboard/admin/categories";
    case "delivery":
      return "/dashboard/delivery/orders";
  }
};

function MainNavbarApp() {
  const { t } = useTranslation();
  const setIsLoginPage = useSetRecoilState(isLoginPageAtom);
  const { user } = useLoggedInUser();
  const navigate = useNavigate();

  return (
    <Navbar style={{ zIndex: 10 }} expand="md" className="bg-body-tertiary">
      <Container className="d-flex justify-content-between w-100">
        <Navbar.Brand
          className="logo text-capitalize"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Link to={"/"}>
            <img style={{ width: "80px" }} src={logo} alt="" />
            <div className="typing-text mt-2"> {t("logo")} </div>
          </Link>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <Icon icon="fa:bars" />
        </Navbar.Toggle>

        <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
          <Nav className="border-top border-start border-bottom">
            <ThemeToggle />
            <LanguageSwitcher />
            {user && user?._id ? (
              <Dropdown>
                <Dropdown.Toggle
                  id="user-menu"
                  className="border-0 d-flex border-end w-100 justify-content-center align-items-center border"
                >
                  <div
                    className="user-avatar main-text d-flex align-items-center justify-content-center me-2"
                    style={{ width: "30px", height: "30px", fontSize: "14px" }}
                  >
                    {user?.name[0]}
                    {user?.name?.split(" ")[1]?.[0]}
                  </div>
                  <span className="main-text">{user?.name?.split(" ")[0]}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    Home{" "}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      navigate(getNavigationPath(user.role as UserRolesType));
                    }}
                  >
                    Dashboard{" "}
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={() => {
                      sessionStorage.removeItem("user");
                      localStorage.removeItem("token");
                      window.location.href = "/";
                    }}
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="links d-flex justify-content-center align-items-center">
                <Link
                  onClick={() => {
                    setIsLoginPage(false);
                  }}
                  style={{ lineHeight: "38px" }}
                  className="main-text  h-100 border-start border-end px-2  text-center text-capitalize alt-bg"
                  to="/auth?signup=true"
                >
                  {t("register")}
                </Link>
                <Link
                  onClick={() => {
                    setIsLoginPage(true);
                  }}
                  style={{ lineHeight: "38px" }}
                  className="main-text h-100 text-center mx-0 px-2 text-capitalize alt-bg"
                  to="/auth?login=true"
                >
                  {t("login")}
                </Link>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavbarApp;

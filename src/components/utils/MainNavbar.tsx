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
                      navigate("/dashboard/change-password");
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
                  className="main-text text-center mx-2 text-capitalize"
                  to="/auth?signup=true"
                >
                  {t("register")}
                </Link>
                <Link
                  onClick={() => {
                    setIsLoginPage(true);
                  }}
                  className="main-text text-center mx-1 text-capitalize"
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

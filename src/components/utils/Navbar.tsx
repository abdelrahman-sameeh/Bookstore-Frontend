import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "../../static/images/logo.png";
import { useTranslation } from "react-i18next";
import Icon from "./Icon";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLoginPageAtom } from "../../recoil/atoms";

function BasicExample() {
  const { t } = useTranslation();
  const [, setIsLoginPage] = useRecoilState(isLoginPageAtom);

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
          <Nav>
            <ThemeToggle />
            <LanguageSwitcher />
            <div className="links d-flex justify-content-center align-items-center">
              <Link
                onClick={() => {
                  setIsLoginPage(false)
                }}
                className="main-text text-center mx-2 text-capitalize"
                to="/auth?signup=true"
                >
                {t("register")}
              </Link>
              <Link
                onClick={() => {
                  setIsLoginPage(true)
                }}
                className="main-text text-center mx-1 text-capitalize"
                to="/auth?login=true"
              >
                {t("login")}
              </Link>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;

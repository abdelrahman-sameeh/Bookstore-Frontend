import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "../../static/images/logo.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import DropdownMenu from "./DropdownMenu";
import NavbarSearchInput from "./NavbarSearchInput";

function MainNavbarApp() {
  const { t } = useTranslation();

  return (
    <Navbar style={{ zIndex: 10 }} expand="md" >
      <Container>
        <Row className="w-100 h-100 mx-0">
          <Col xs={3}>
            <Navbar.Brand className="logo text-capitalize d-flex align-items-center">
              <Link to={"/"}>
                <img style={{ width: "80px" }} src={logo} alt="" />
                <div className="typing-text mt-2"> {t("navbar.logo")} </div>
              </Link>
            </Navbar.Brand>
          </Col>

          <Col
            xs={9}
            className="d-flex align-items-center justify-content-end"
          >
            <NavbarSearchInput />
            <ThemeToggle />
            <LanguageSwitcher />
            <DropdownMenu />
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

export default MainNavbarApp;

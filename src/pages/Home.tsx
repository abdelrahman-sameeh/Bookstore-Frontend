import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import landingImage from "../static/images/landing-page.png";
import { Link } from "react-router-dom";

export const Home = () => {
  const { t } = useTranslation();
  return (
    <section className="home alt-bg p-5">
      <div className="p-5"></div>

      {/* hero section */}
      <Container className="hero">
        <Row className="align-items-center">
          <Col sm={"12"} md={6} lg={6}>
            <h1 className="text-capitalize">{t("heroH1")}</h1>
            <p className="alt-text">{t("heroP")}</p>
            <Link to="/books" className="btn text-capitalize main-bg pt-3">
              {t("heroBtn")}
            </Link>
          </Col>
          <Col
            sm={"12"}
            md={6}
            lg={6}
            className="p-5 d-flex justify-content-center align-items-center"
          >
            <img
              style={{ width: "100%", maxWidth: "300px" }}
              src={landingImage}
              alt=""
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

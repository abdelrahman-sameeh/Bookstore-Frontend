import { Button, Col, Row } from "react-bootstrap";
import supportImage from "../../static/images/support.png";
import { useTranslation } from "react-i18next";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import { Link } from "react-router-dom";
import authAxios from "../../api/authAxios";
import { ApiEndpoints } from "../../api/ApiEndpoints";
import notify from "../../components/utils/Notify";
import { useState } from "react";
import LoadingButton from "../../components/utils/LoadingButton";

const Support = () => {
  const { t } = useTranslation();
  const { user } = useLoggedInUser();
  const [loading, setLoading] = useState(false);

  const chatWithSupport = async () => {
    setLoading(true);
    const response = await authAxios(
      true,
      ApiEndpoints.chatWithSupport,
      "POST"
    );
    if (response.status === 200) {
      notify(t("support.redirectToSupport"), "success", 1500);
      setTimeout(() => {
        window.location.href = response.data.data.link;
      }, 1500);
    } else {
      notify(t("support.errorOccurred"));
    }
    setLoading(false);
  };

  return (
    <section>
      <div className="container">
        <Row className="mx-0">
          <Col sm={12} md={6}>
            <div className="image">
              <img
                className="w-100 h-100 object-fit-cover"
                src={supportImage}
                alt={t("support.imageAlt")}
              />
            </div>
          </Col>
          <Col
            sm={12}
            md={6}
            className="d-flex gap-3 flex-column justify-content-center"
          >
            <h1>{t("support.title")}</h1>
            <p className="mb-0">{t("support.description")}</p>
            {user._id ? (
              <LoadingButton
                loading={loading}
                onClick={chatWithSupport}
                className="outline-main-btn"
              >
                {t("support.startChatButton")}
              </LoadingButton>
            ) : (
              <Link to={"/auth?login=true"} className="btn outline-main-btn">
                {t("support.registerToStartChat")}
              </Link>
            )}
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Support;

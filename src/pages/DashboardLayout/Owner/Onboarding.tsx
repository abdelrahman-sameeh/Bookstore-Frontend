import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import LoadingButton from "../../../components/utils/LoadingButton";
import authAxios from "../../../api/authAxios";
import { ApiEndpoints } from "../../../api/ApiEndpoints";
import { useState } from "react";
import notify from "../../../components/utils/Notify";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import Icon from "../../../components/utils/Icon";
import Tooltip from "../../../components/utils/Tooltip";

const Onboarding = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { user  } = useLoggedInUser(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const response = await authAxios(true, ApiEndpoints.onboarding, "POST");
    if (response?.status === 200) {
      window.location.href = response?.data?.url;
    } else {
      notify(t("failedMessage"), "error");
    }
    setLoading(false);
  };
  

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={8} md={10} sm={12}>
          <h1 className="text-center mb-4">{t("owner.onboarding.welcome")}</h1>
          <p className="text-center mb-4">{t("owner.onboarding.intro")}</p>

          <h3>{t("owner.onboarding.steps")}</h3>
          <ul>
            <li>{t("owner.onboarding.step1")}</li>
            <li>{t("owner.onboarding.step2")}</li>
            <li>{t("owner.onboarding.step3")}</li>
          </ul>

          <div className="text-center my-4">
            <form
              className="d-flex gap-2 align-items-center"
              onSubmit={handleSubmit}
            >
              {(user.completedBoarding && user.stripeAccountId) ? (
                <Tooltip message={t('owner.onboarding.completeOnboard')} direction="bottom">
                  <Icon
                    className="fs-3 text-success"
                    icon="ic:outline-gpp-good"
                  />
                </Tooltip>
              ) : (
                <Tooltip message={t('owner.onboarding.uncompletedOnboard')} direction="bottom">
                  <Icon
                    className="fs-3"
                    style={{ color: "#e88f1b" }}
                    icon="mdi:alert-outline"
                  />
                </Tooltip>
              )}
              <LoadingButton loading={loading} type="submit">
                {user.completedBoarding && user.stripeAccountId
                  ? t("owner.onboarding.updateStripeOnboarding")
                  : t("owner.onboarding.registerStripeOnboarding")}
              </LoadingButton>
            </form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Onboarding;

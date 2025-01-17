import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next"; // استيراد الـ useTranslation
import notify from "../../components/utils/Notify";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import authAxios from "../../api/authAxios";
import { ApiEndpoints } from "../../api/ApiEndpoints";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import Icon from "../../components/utils/Icon";
import LoadingButton from "../../components/utils/LoadingButton";

const UserDetails = () => {
  const { t } = useTranslation(); // استخدام الترجمة
  const { id } = useParams();
  const { user: loggedUser } = useLoggedInUser();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const handleNotValidUser = () => {
      notify(t("UserDetails.invalidPage"), "error", 1500);
      setTimeout(() => {
        navigate("/");
      }, 1500);
      return false;
    };

    const checkIdParamsIsValid = async (id: string) => {
      if (id === loggedUser?._id) {
        return handleNotValidUser();
      }

      const response = await authAxios(true, ApiEndpoints.isExistUser(id));
      if (response.status === 404) {
        return handleNotValidUser();
      }
      if (response.status === 200) {
        setUser(response?.data?.data?.user);
      }
    };

    checkIdParamsIsValid(id as string);
  }, [loggedUser, id, navigate, t]);

  const handleChatClick = () => {
    window.location.href = `/chat/${id}`;
  };

  const getInitials = (name: string) => {
    return name && name[0].toUpperCase();
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="secondary-bg alt-bg main-text">
            <Card.Body>
              <div className="text-center mb-4">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="img-fluid rounded-circle"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="d-flex rounded-full border justify-content-center align-items-center main-bg main-text rounded-circle m-auto"
                    style={{ width: "120px", height: "120px" }}
                  >
                    <span className="h1">{getInitials(user.name)}</span>
                  </div>
                )}
              </div>
              <h3 className="mb-4 text-center">{user.name}</h3>
              <div className="d-flex justify-content-center flex-column align-items-center gap-2 mb-3">
                <div>
                  <strong>{t("UserDetails.email")}:</strong> {user.email}
                </div>
                <LoadingButton
                  onClick={handleChatClick}
                  className="d-flex align-items-center gap-1 justify-content-center"
                >
                  <Icon icon="iconamoon:comment-light" />
                  {t("UserDetails.startChat")}
                </LoadingButton>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDetails;

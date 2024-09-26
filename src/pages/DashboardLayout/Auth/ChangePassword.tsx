import { Form } from "react-bootstrap";
import LoadingButton from "../../../components/utils/LoadingButton";
import { useState } from "react";
import authAxios from "../../../api/authAxios";
import { ApiEndpoints } from "../../../api/ApiEndpoints";
import notify from "../../../components/utils/Notify";
import { useTranslation } from "react-i18next";

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const response = await authAxios(true, ApiEndpoints.changePassword, 'POST', { password });
    setLoading(false);

    if (response.status === 200) {
      notify(t('changePassword.passwordChangedSuccessfully'), 'success');
      notify(t('changePassword.logoutIn5Seconds'), 'warn', 5000);
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      setTimeout(() => {
        window.location.href = '/auth?login=true';
      }, 6000);
    } else {
      notify(t('changePassword.failedToChangePassword'), 'error');
    }
  };

  return (
    <div>
      <div className="container alt-bg py-3">
        <h2 className="fw-bold fs-1 mb-4"> {t('changePassword.changeOldPassword')} </h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>{t('changePassword.newPassword')}</Form.Label>
            <Form.Control
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder={t('changePassword.enterNewPassword')}
            />
          </Form.Group>
          <LoadingButton loading={loading}>{t('changePassword.changePassword')}</LoadingButton>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;

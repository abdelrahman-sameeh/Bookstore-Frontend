import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import { useRecoilState } from "recoil";
import { languageState } from "../../recoil/atoms";
import authAxios from "../../api/authAxios";
import { ApiEndpoints } from "../../api/ApiEndpoints";
import { useNavigate } from "react-router-dom";
import notify from "../../components/utils/Notify";
import Icon from "../../components/utils/Icon";
import LoadingButton from "../../components/utils/LoadingButton";

const ForgetPasswordForm = () => {
  const { t } = useTranslation();
  const [lang] = useRecoilState(languageState); // Get language state from Recoil
  const [isClickedToSubmit, setIsClickedToSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [placement, setPlacement] = useState<"left" | "right" | "bottom">(
    lang === "ar" ? "right" : "left"
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 576) {
        setPlacement("bottom");
      } else {
        setPlacement(lang === "ar" ? "right" : "left");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [lang]);

  // State for form fields
  const [formData, setFormData] = useState({
    email: "",
  });

  // State for errors
  const [errors, setErrors] = useState({
    email: "",
  });

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setErrors((errors) => ({ ...errors, [name]: "" }));
    setFormData({ ...formData, [name]: value });
  };

  // Validation function
  const validateForm = () => {
    const newErrors = { email: "" };
    let isValid = true;
    if (
      !formData.email ||
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
    ) {
      newErrors.email = t("registerInputEmail") + " " + t("isInvalid");
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsClickedToSubmit(true);
    if (!validateForm()) {
      return false;
    }
    setLoading(true);
    const response = await authAxios(
      false,
      ApiEndpoints.sendResetCode,
      "POST",
      formData
    );
    setLoading(false);
    localStorage.email = formData.email;
    // show notify here
    if (response?.status == 200) {
      notify(t("resetCodeSuccessMessage"), "success");
      setErrors({ email: "" });
      setFormData({ email: "" });
      navigate("/verify-reset-code");
    } else {
      setIsClickedToSubmit(false);
      if (response.status === 404) {
        notify(t("resetCodeEmailNotFound"), "error");
      } else {
        notify(t("failedMessage"), "error");
      }
    }
  };

  const renderTooltip = (error: string) => (
    <Tooltip id="button-tooltip">{error}</Tooltip>
  );

  return (
    <section className="page auth-page forget-password">
      <main className="main">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <h2 className="text-capitalize text-center fw-bold pb-3">
            {t("resetCodeLabel")}
          </h2>

          <div className={`container`}>
            <div className="d-flex align-items-center gap-2 flex-row-reverse justify-content-center mt-2">
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control`}
                style={{ paddingRight: "30px" }}
                placeholder={t("resetCodeInputEmail")}
              />

              {isClickedToSubmit &&
                (errors.email ? (
                  <OverlayTrigger
                    placement={placement}
                    overlay={renderTooltip(errors.email)}
                  >
                    <div className="pointer">
                      <Icon
                        style={{ color: "red" }}
                        icon="material-symbols:error-outline"
                      />
                    </div>
                  </OverlayTrigger>
                ) : (
                  <Icon style={{ color: "green" }} icon="ep:success-filled" />
                ))}
            </div>

            <div className="d-flex flex-column align-items-center">
              <LoadingButton
                children={t("resetCodeBtn")}
                loading={loading}
                type="submit"
              />
            </div>
          </div>
        </form>
      </main>
    </section>
  );
};

export default ForgetPasswordForm;

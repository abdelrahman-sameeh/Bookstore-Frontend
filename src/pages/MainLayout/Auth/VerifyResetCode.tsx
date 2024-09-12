import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import { useRecoilState } from "recoil";
import { languageState } from "../../../recoil/atoms";
import authAxios from "../../../api/authAxios";
import { ApiEndpoints } from "../../../api/ApiEndpoints";
import { useNavigate } from "react-router-dom";
import notify from "../../../components/utils/Notify";
import Icon from "../../../components/utils/Icon";
import LoadingButton from "../../../components/utils/LoadingButton";

const VerifyResetCode = () => {
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
    code: "",
    password: "",
  });

  // State for errors
  const [errors, setErrors] = useState({
    code: "",
    password: "",
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
    const newErrors = { code: "", password: "" };
    let isValid = true;

    if (!formData.code) {
      newErrors.code = t("isRequired");
      isValid = false;
    }
    if ((formData.code && formData.code.length != 6) || isNaN(+formData.code)) {
      newErrors.code = t("resetCodeValidationMessage");
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = t("isRequired");
      isValid = false;
    }
    if (formData.password && formData.password.length < 4) {
      newErrors.password = t("registerInputPassword") + " " + t("isTooShort");
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
    const data = {
      ...formData,
      email: localStorage.email,
    };

    const response = await authAxios(
      false,
      ApiEndpoints.forgetPassword,
      "POST",
      data
    );
    setLoading(false);

    // show notify here
    if (response?.status == 200) {
      notify(t("verifyResetCodeSuccessMessage"), "success");
      localStorage.removeItem("email");
      setErrors({ code: "", password: "" });
      setFormData({ email: "", code: "", password: "" });
      navigate("/auth");
    } else {
      setIsClickedToSubmit(false);
      if (response?.data?.message?.toLowerCase() == "reset code has expired") {
        notify(t("ResetCodeHasExpired"), "error");
        navigate("/reset-code");
      } else if (
        response?.data?.message?.toLowerCase() == "reset code is wrong"
      ) {
        notify(t("ResetCodeIsWrong"), "error");
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
            {t("verifyResetCodeLabel")}
          </h2>

          <div className={`container`}>
            <div className="d-flex align-items-center gap-2 flex-row-reverse justify-content-center mt-2">
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={`form-control`}
                style={{ paddingRight: "30px" }}
                placeholder={t("verifyResetCodeInputCode")}
              />
              {isClickedToSubmit &&
                (errors.code ? (
                  <OverlayTrigger
                    placement={placement}
                    overlay={renderTooltip(errors.code)}
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

            <div className="d-flex align-items-center gap-2 flex-row-reverse justify-content-center mt-2">
              <input
                type="password"
                id="registerPassword"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-control`}
                style={{ paddingRight: "30px" }}
                placeholder={t("verifyResetCodeInputPassword")}
              />
              {isClickedToSubmit &&
                (errors.password ? (
                  <OverlayTrigger
                    placement={placement}
                    overlay={renderTooltip(errors.password)}
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
                children={t("verifyResetCodeBtn")}
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

export default VerifyResetCode;

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import Icon from "../utils/Icon";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoginPageAtom, languageState } from "../../recoil/atoms";
import authAxios from "../../api/authAxios";
import { ApiEndpoints } from "../../api/ApiEndpoints";
import LoadingButton from "../utils/LoadingButton";
import notify from "../utils/Notify";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const { t } = useTranslation();
  const [lang] = useRecoilState(languageState); // Get language state from Recoil
  const [isClickedToSubmit, setIsClickedToSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [, setIsLogin] = useRecoilState(isLoginPageAtom);
  const isLogin = useRecoilValue(isLoginPageAtom);

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
    name: "",
    email: "",
    password: "",
    role: "",
  });

  // State for errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
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
    const newErrors = { name: "", email: "", password: "", role: "" };
    let isValid = true;

    if (!formData.name) {
      newErrors.name = t("registerInputName") + " " + t("isRequired");
      isValid = false;
    }
    if (
      !formData.email ||
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
    ) {
      newErrors.email = t("registerInputEmail") + " " + t("isInvalid");
      isValid = false;
    }
    if (formData.password.length < 6) {
      newErrors.password = t("registerInputPassword") + " " + t("isTooShort");
      isValid = false;
    }
    if (!formData.role) {
      newErrors.role = t("registerSelectPlaceholder") + " " + t("isRequired");
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
      ApiEndpoints.register,
      "POST",
      formData
    );
    setLoading(false);

    // show notify here
    if (response?.status == 201) {
      notify(t("registerSuccessMessage"), "success");
      localStorage.token = response?.data?.data?.token;
      setErrors({ email: "", name: "", password: "", role: "" });
      setFormData({ email: "", name: "", password: "", role: "" });
      window.location.href = '/'
    } else {
      setIsClickedToSubmit(false);
      if (response?.data?.message === "Email already exist") {
        notify(t("registerEmailAlreadyUsedMessage"), "error");
      } else {
        notify(t("failedMessage"), "error");
      }
    }
  };

  const renderTooltip = (error: string) => (
    <Tooltip id="button-tooltip">{error}</Tooltip>
  );

  return (
    <div className="signup">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label
          onClick={() => {
            setIsLogin(false);
            navigate("/auth?signup=true");
          }}
          className="text-capitalize"
        >
          {t("registerLabel")}
        </label>

        <div className={`container ${isLogin ? "d-none" : ""}`}>
          <div className="d-flex align-items-center gap-2 flex-row-reverse justify-content-center mt-2">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-control`}
              style={{ paddingRight: "30px" }}
              placeholder={t("registerInputName")}
            />

            {isClickedToSubmit &&
              (errors.name ? (
                <OverlayTrigger
                  placement={placement}
                  overlay={renderTooltip(errors.name)}
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
              type="email"
              id="registerEmail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control`}
              style={{ paddingRight: "30px" }}
              placeholder={t("registerInputEmail")}
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

          <div className="d-flex align-items-center gap-2 flex-row-reverse justify-content-center mt-2">
            <input
              type="password"
              id="registerPassword"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-control`}
              style={{ paddingRight: "30px" }}
              placeholder={t("registerInputPassword")}
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

          <div className="d-flex align-items-center gap-2 flex-row-reverse justify-content-center mt-2">
            <select
              className={`form-select`}
              style={{ paddingRight: "30px" }}
              name="role"
              value={formData.role}
              onChange={handleChange}
              aria-label="Default select example"
            >
              <option value="">{t("registerSelectPlaceholder")}</option>
              <option value="user">{t("registerSelectOpt1")}</option>
              <option value="owner">{t("registerSelectOpt2")}</option>
              <option value="delivery">{t("registerSelectOpt3")}</option>
            </select>
            {isClickedToSubmit &&
              (errors.role ? (
                <OverlayTrigger
                  // here need in small screen to be button other wise select by land
                  placement={placement}
                  overlay={renderTooltip(errors.role)}
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
            children={t("registerBtn")}
            loading={loading}
            type="submit"
            />
            </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;

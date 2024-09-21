import { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoginPageAtom, languageState } from "../../recoil/atoms";
import Icon from "../utils/Icon";
import notify from "../utils/Notify";
import authAxios from "../../api/authAxios";
import { ApiEndpoints } from "../../api/ApiEndpoints";
import { Link, useNavigate } from "react-router-dom";
import LoadingButton from "../utils/LoadingButton";

const LoginForm = () => {
  const { t } = useTranslation();
  const [lang] = useRecoilState(languageState); // Get language state from Recoil
  const [isClickedToSubmit, setIsClickedToSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isLoginPage = useRecoilValue(isLoginPageAtom);
  const [, setIsLoginPage] = useRecoilState(isLoginPageAtom);

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
    password: "",
  });

  // State for errors
  const [errors, setErrors] = useState({
    email: "",
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
    const newErrors = { name: "", email: "", password: "", role: "" };
    let isValid = true;

    if (
      !formData.email ||
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
    ) {
      newErrors.email = t("registerInputEmail") + " " + t("isInvalid");
      isValid = false;
    }
    if (formData.password.length < 1) {
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
    const response = await authAxios(
      false,
      ApiEndpoints.login,
      "POST",
      formData
    );
    setLoading(false);

    // show notify here
    if (response?.status == 200) {
      notify(t("loginSuccessMessage"), "success");
      localStorage.token = response?.data?.data?.token;
      sessionStorage.user = JSON.stringify(response?.data?.data?.user);
      setErrors({ email: "", password: "" });
      setFormData({ email: "", password: "" });
      window.location.href = "/";
    } else {
      console.log(response);
      
      setIsClickedToSubmit(false);
      if (
        response?.data?.message === "email or password are incorrect"||
        response?.data?.errors[0]?.msg === "email or password are incorrect" 
      ) {
        notify(t("loginEmailOrPasswordIncorrectMessage"), "error");
      } else {
        notify(t("failedMessage"), "error");
      }
    }
  };

  // Tooltip wrapper component
  const renderTooltip = (error: string) => (
    <Tooltip id="button-tooltip">{error}</Tooltip>
  );

  return (
    <div className="login">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label
          onClick={() => {
            setIsLoginPage(true);
            navigate("/auth?login=true");
          }}
          className="text-capitalize"
        >
          {t("loginLabel")}
        </label>

        <div className={`container ${!isLoginPage ? "d-none" : ""}`}>
          <div className="d-flex align-items-center gap-2 flex-row-reverse justify-content-center mt-2">
            <input
              type="email"
              id="loginEmail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control ps-4`}
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
              id="loginPassword"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-control ps-4`}
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
          <div className="d-flex flex-column align-items-center">
            <LoadingButton
              children={t("loginBtn")}
              loading={loading}
              type="submit"
            />
            <Link className="text-dark mt-2" to={"/reset-code"}>
              {" "}
              {t("forgetPasswordLink")}{" "}
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

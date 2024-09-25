import RegisterForm from "../../../components/Auth/RegisterForm";
import LoginForm from "../../../components/Auth/LoginForm";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLoginPageAtom } from "../../../recoil/utils";

const RegisterLoginPage = () => {
  const checkboxInput = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search);
  const [, setIsLoginPage] = useRecoilState(isLoginPageAtom);

  useEffect(() => {
    const isLoginQuery = searchQuery.get("login") === "true";
    setIsLoginPage(isLoginQuery);
  }, []);

  useEffect(() => {
    const isLoginQuery = searchQuery.get("login") === "true";
    if (checkboxInput.current) {
      checkboxInput.current.checked = isLoginQuery;
    }
  }, [searchQuery]);

  return (
    <section className="register-login d-flex justify-content-center flex-column align-items-center gap-3">
      <div className="container d-flex justify-content-center">
        <div className="main">
          <input
            ref={checkboxInput}
            type="checkbox"
            id="chk"
            aria-hidden="true"
          />
          <RegisterForm />
          <LoginForm />
        </div>
      </div>
    </section>
  );
};

export default RegisterLoginPage;

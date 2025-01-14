import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { languageState } from "../../recoil/utils";
import Icon from "../utils/Icon";

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [lang, setLang] = useRecoilState(languageState); // Get language state from Recoil

  useEffect(() => {
    i18n.changeLanguage(lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    setTimeout(() => {
      document.body.classList.toggle("ltr", lang === "en");
      document.body.classList.toggle("rtl", lang === "ar");
    }, 10);
    localStorage.setItem("language", lang);
  }, [lang, i18n]);

  // Function to handle language change
  const changeLanguage = (lng: string) => {
    setLang(lng); // Update Recoil state (which will trigger useEffect)
  };

  return (
    <button
      onClick={() => changeLanguage(lang == "en" ? "ar" : "en")}
      className="btn text-light border-0 m-0"
      title={t("navbar.changeLang")}
    >
      <Icon icon="ph:translate-fill" className="fs-3" />
    </button>
  );
};

export default LanguageSwitcher;

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { languageState } from "../../recoil/atoms";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
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
    <div className="btn-group">
      <button
        onClick={() => changeLanguage("en")}
        className="btn btn-secondary main-btn border"
      >
        En
      </button>
      <button
        onClick={() => changeLanguage("ar")}
        className="btn btn-secondary main-btn border"
      >
        ع
      </button>
    </div>
  );
};

export default LanguageSwitcher;

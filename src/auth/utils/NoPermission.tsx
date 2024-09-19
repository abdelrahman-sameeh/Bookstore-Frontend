import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const NoPermission = () => {
  const { t } = useTranslation();

  return (
    <div className="page" style={{ textAlign: "center", padding: "50px" }}>
      <h1>{t("noPermission.title")}</h1>
      <p>{t("noPermission.message")}</p>
      <Link to="/">{t("noPermission.backHome")}</Link>
    </div>
  );
};

export default NoPermission;

import networkConnectioImage from "../../static/images/network-connection.png";
import Icon from "../../components/utils/Icon";
import { useTranslation } from "react-i18next";

const MainChatPage = () => {
  const { t } = useTranslation();
  return (
    <div className="main-chat-page secondary-bg p-2 d-flex flex-column align-items-center justify-content-center">
      <img src={networkConnectioImage} alt="Connection" />
      <h4 className="mt-5 fw-bold">{t("mainChatting.title")}</h4>
      <p className="mt-3 text-center">
        {t("mainChatting.msgInfo")}
        <br />
        {t("mainChatting.msgUsage")}
      </p>
      <p className="mt-4">
        <Icon icon="mingcute:lock-line" className="mx-1 fs-5" />
        {t("mainChatting.encryptionNote")}
      </p>
    </div>
  );
};

export default MainChatPage;

import { Link } from "react-router-dom";
import Icon from "../utils/Icon";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="main-bg-dark py-3 text-light mt-3">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0">{t("footer.connectMessage")}:</p>
          <ul className="mb-0 social-links d-flex list-unstyled gap-1 flex-wrap">
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.linkedin.com/in/abdelrahman-sameeh-384508231/"
              >
                <Icon className="fs-3" icon="mdi:linkedin" />
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/abdelrahman-sameeh"
              >
                <Icon className="fs-3" icon="ion:social-github" />
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://wa.me/+201556577857"
              >
                <Icon className="fs-3" icon="ic:baseline-whatsapp" />
              </a>
            </li>
          </ul>
        </div>
        <Link to={"/support"} className="my-1 d-block">
          {t("footer.supportMessage")}
          <strong className="mx-1">
            {t("footer.contactUs")}
            <Icon className="fs-3" icon="ic:round-contact-support" />
          </strong>
        </Link>
        <div className="d-flex justify-content-between align-items-center">
          <div className="copy">© 2025 {t("footer.copyright")}</div>
          <p className="mb-0">
            {t("footer.createdBy")}{" "}
            <strong>
              <a
                href="https://www.linkedin.com/in/abdelrahman-sameeh-384508231/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Abdelrahman Sameeh
              </a>
            </strong>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useEffect, useRef, useState } from "react";
import { Col } from "react-bootstrap";
import Icon from "../utils/Icon";
import { useRecoilValue } from "recoil";
import { languageState } from "../../recoil/utils";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Role = "user" | "admin" | "owner" | "delivery";
type Link = {
  title: string;
  to: string;
  icon: string;
};

type LinksType = {
  [key in Role]: Link[];
};

const getUserLinks = (t: any): LinksType => ({
  admin: [
    {
      title: t("dashboard.shared.links.home"),
      to: "/",
      icon: "iconamoon:home-bold",
    },
    {
      title: t("dashboard.shared.links.changePassword"),
      to: "change-password",
      icon: "solar:password-outline",
    },
    {
      title: t("dashboard.admin.links.categories"),
      to: "admin/categories",
      icon: "iconamoon:category",
    },
  ],
  user: [
    {
      title: t("dashboard.shared.links.home"),
      to: "/",
      icon: "iconamoon:home-bold",
    },
    {
      title: t("dashboard.shared.links.changePassword"),
      to: "change-password",
      icon: "solar:password-outline",
    },
  ],
  owner: [
    {
      title: t("dashboard.shared.links.home"),
      to: "/",
      icon: "iconamoon:home-bold",
    },
    {
      title: t("dashboard.shared.links.changePassword"),
      to: "change-password",
      icon: "solar:password-outline",
    },
    {
      title: t("dashboard.owner.links.stripe"),
      to: "owner/onboarding",
      icon: "formkit:stripe",
    },
    {
      title: t("dashboard.owner.links.viewBooks"),
      to: "owner/books",
      icon: "bi:book",
    },
  ],
  delivery: [
    {
      title: t("dashboard.shared.links.home"),
      to: "/",
      icon: "iconamoon:home-bold",
    },
    {
      title: t("dashboard.shared.links.changePassword"),
      to: "change-password",
      icon: "solar:password-outline",
    },
  ],
});

const DashboardSidebar = () => {
  const [iconName, setIconName] = useState<
    "mdi:arrow-right" | "mdi:arrow-left"
  >("mdi:arrow-right");
  const iconRef = useRef<HTMLSpanElement>(null);
  const lang = useRecoilValue(languageState);
  const { user } = useLoggedInUser();

  const { t } = useTranslation();

  const renderUserLinks = () => {
    if (!user || !user.role) {
      return null;
    }

    const userLinks = getUserLinks(t)[user.role as Role];

    return (
      <ul className="nav flex-column">
        {userLinks.map((link, index) => (
          <NavLink
            className="nav-link text-capitalize d-flex gap-1 align-items-center"
            to={link.to}
            key={link.title + link.to + index}
          >
            <Icon className="fs-4" icon={link.icon} />
            <span>{link.title}</span>
          </NavLink>
        ))}
      </ul>
    );
  };

  useEffect(() => {
    if (lang === "ar") {
      setIconName("mdi:arrow-left");
    } else {
      setIconName("mdi:arrow-right");
    }
  }, [lang]);

  const handleClick = () => {
    iconRef.current?.classList.toggle("show");
    setIconName((prevIcon: string) =>
      prevIcon === "mdi:arrow-right" ? "mdi:arrow-left" : "mdi:arrow-right"
    );
  };

  const isShowClass =
    (lang === "ar" && iconName === "mdi:arrow-right") ||
    (lang === "en" && iconName === "mdi:arrow-left");

  return (
    <>
      <span ref={iconRef} onClick={handleClick} className="arrow w-fit alt-btn">
        <Icon icon={iconName}></Icon>
      </span>
      <Col lg={3} className={`alt-bg p-3 sidebar ${isShowClass ? "show" : ""}`}>
        <h4>Sidebar</h4>
        {renderUserLinks()}
      </Col>
    </>
  );
};

export default DashboardSidebar;

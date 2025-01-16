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
      title: t("dashboard.admin.links.categories"),
      to: "admin/categories",
      icon: "iconamoon:category",
    },
    {
      title: t("dashboard.admin.links.manageBooks"),
      to: "admin/books",
      icon: "bi:book",
    },
    {
      title: t("dashboard.admin.links.manageOrders"),
      to: "admin/orders",
      icon: "icon-park-solid:transaction-order",
    },
    {
      title: t("dashboard.shared.links.changePassword"),
      to: "change-password",
      icon: "solar:password-outline",
    },
    {
      title: t("dashboard.shared.links.setting"),
      to: "setting",
      icon: "uil-setting",
    },
  ],
  user: [
    {
      title: t("dashboard.shared.links.home"),
      to: "/",
      icon: "iconamoon:home-bold",
    },
    {
      title: t("dashboard.user.links.yourOnlineBooks"),
      to: "user/books",
      icon: "noto:books",
    },
    {
      title: t("dashboard.user.links.addresses"),
      to: "user/addresses",
      icon: "tabler:location",
    },
    {
      title: t("dashboard.user.links.cart"),
      to: "user/cart",
      icon: "mdi-light:cart",
    },
    {
      title: t("dashboard.user.links.orders"),
      to: "user/orders",
      icon: "icon-park-solid:transaction-order",
    },
    {
      title: t("dashboard.shared.links.changePassword"),
      to: "change-password",
      icon: "solar:password-outline",
    },
    {
      title: t("dashboard.shared.links.setting"),
      to: "setting",
      icon: "uil-setting",
    },
  ],
  owner: [
    {
      title: t("dashboard.shared.links.home"),
      to: "/",
      icon: "iconamoon:home-bold",
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
    {
      title: t("dashboard.owner.links.coupons"),
      to: "owner/coupons",
      icon: "mdi:coupon",
    },
    {
      title: t("dashboard.shared.links.changePassword"),
      to: "change-password",
      icon: "solar:password-outline",
    },
    {
      title: t("dashboard.shared.links.setting"),
      to: "setting",
      icon: "uil-setting",
    },
  ],
  delivery: [
    {
      title: t("dashboard.shared.links.home"),
      to: "/",
      icon: "iconamoon:home-bold",
    },
    {
      title: t("dashboard.delivery.links.orders"),
      to: "delivery/orders",
      icon: "solar:password-outline",
    },
    {
      title: t("dashboard.shared.links.changePassword"),
      to: "change-password",
      icon: "solar:password-outline",
    },
    {
      title: t("dashboard.shared.links.setting"),
      to: "setting",
      icon: "uil-setting",
    },
  ],
});

const DashboardSidebar = () => {
  const [iconName, setIconName] = useState<
    "mdi:arrow-right" | "mdi:arrow-left"
  >("mdi:arrow-right");
  const iconRef = useRef<HTMLSpanElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLElement>(null);
  const lang = useRecoilValue(languageState);
  const { user } = useLoggedInUser();

  const { t } = useTranslation();

  const renderUserLinks = () => {
    if (!user || !user.role) {
      return null;
    }

    const userLinks = getUserLinks(t)[user.role as Role];

    return (
      <ul className="nav flex-column p-0">
        {userLinks.map((link, index) => (
          <NavLink
            className="nav-link text-capitalize d-flex gap-1 align-items-center"
            to={link.to}
            style={{
              width: "100%",
              wordBreak: "break-all",
            }}
            onClick={() => {
              iconRef.current?.classList.remove("show");
              sidebarRef.current?.classList.remove("show");
              setIconName((prevIcon: string) =>
                prevIcon === "mdi:arrow-right"
                  ? "mdi:arrow-left"
                  : "mdi:arrow-right"
              );
            }}
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
    iconRef.current?.classList.remove("show");
    sidebarRef.current?.classList.remove("show");
  }, [lang]);

  
  const handleClick = () => {
    iconRef.current?.classList.toggle("show");
    sidebarRef.current?.classList.toggle("show");
    setIconName((prevIcon: string) =>
      prevIcon === "mdi:arrow-right" ? "mdi:arrow-left" : "mdi:arrow-right"
    );
  };

  return (
    <>
      {sidebarRef.current?.classList.contains("show") && (
        <div
          onClick={() => {
            overlayRef.current?.classList.remove("show");
            iconRef.current?.classList.remove("show");
            sidebarRef.current?.classList.remove("show");
            setIconName((prevIcon: string) =>
              prevIcon === "mdi:arrow-right"
                ? "mdi:arrow-left"
                : "mdi:arrow-right"
            );
          }}
          className="overlay show"
        ></div>
      )}

      <span ref={iconRef} onClick={handleClick} className="arrow w-fit main-btn">
        <Icon icon={iconName}></Icon>
      </span>
      <Col
        ref={sidebarRef}
        lg={3}
        className={`position-fixed alt-bg p-3 sidebar border-top`}
      >
        <h4 className="fw-bold text-light text-capitalize"> {t('dashboard.dashboard')} </h4>
        {renderUserLinks()}
      </Col>
    </>
  );
};

export default DashboardSidebar;

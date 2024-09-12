import { useEffect, useRef, useState } from "react";
import { Col } from "react-bootstrap";
import Icon from "../utils/Icon";
import { useRecoilValue } from "recoil";
import { languageState } from "../../recoil/atoms";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import { Link } from "react-router-dom";

type Role = "user" | "admin" | "owner" | "delivery";
type Link = {
  title: string;
  to: string;
};

type LinksType = {
  [key in "user" | "admin" | "owner" | "delivery"]: Link[];
};

const links: LinksType = {
  user: [
    {
      title: "home",
      to: "/",
    },
    {
      title: "change password",
      to: "change-password",
    },
    {
      title: "carts",
      to: "carts",
    },
  ],
  admin: [],
  owner: [],
  delivery: [],
};

const DashboardSidebar = () => {
  const [iconName, setIconName] = useState<
    "mdi:arrow-right" | "mdi:arrow-left"
  >("mdi:arrow-right");
  const iconRef = useRef<HTMLSpanElement>(null);
  const lang = useRecoilValue(languageState);
  const { user } = useLoggedInUser();

  const renderUserLinks = () => {
    if (!user || !user.role) {
      return null;
    }

    const userLinks = links[user.role as Role] || [];

    return (
      <ul className="nav flex-column">
        {userLinks.map((link, index) => (
          <li className="nav-item" key={link.title + link.to + index}>
            <Link className="nav-link" to={link.to}>
              {link.title}
            </Link>
          </li>
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
      <span ref={iconRef} onClick={handleClick} className="arrow w-fit">
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

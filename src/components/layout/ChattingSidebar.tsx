import { useEffect, useRef, useState } from "react";
import { Col } from "react-bootstrap";
import Icon from "../utils/Icon";
import { useRecoilValue } from "recoil";
import { languageState } from "../../recoil/utils";
import { useTranslation } from "react-i18next";


const ChattingSidebar = () => {
  const [iconName, setIconName] = useState<
    "mdi:arrow-right" | "mdi:arrow-left"
  >("mdi:arrow-right");
  const iconRef = useRef<HTMLSpanElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLElement>(null);
  const lang = useRecoilValue(languageState);

  const { t } = useTranslation();

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

      <span ref={iconRef} onClick={handleClick} className="arrow w-fit alt-btn">
        <Icon icon={iconName}></Icon>
      </span>
      <Col
        ref={sidebarRef}
        lg={3}
        className={`position-fixed alt-bg p-3 sidebar`}
      >
        <h4 className="fw-bold"> users </h4>

      

      </Col>
    </>
  );
};

export default ChattingSidebar;

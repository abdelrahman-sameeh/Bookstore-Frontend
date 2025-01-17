import { useEffect, useRef, useState } from "react";
import { Button, Col } from "react-bootstrap";
import Icon from "../utils/Icon";
import { useRecoilValue } from "recoil";
import { languageState } from "../../recoil/utils";
import { useTranslation } from "react-i18next";
import authAxios from "../../api/authAxios";
import { ApiEndpoints } from "../../api/ApiEndpoints";
import { useParams } from "react-router-dom";
import { ChatInterface } from "../../interfaces/interfaces";
import ChatLink from "../Chat/ChatLink";

const ChattingSidebar = () => {
  const [iconName, setIconName] = useState<
    "mdi:arrow-right" | "mdi:arrow-left"
  >("mdi:arrow-right");
  const iconRef = useRef<HTMLSpanElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLElement>(null);
  const lang = useRecoilValue(languageState);
  const [archived, setArchived] = useState(false);
  const [chats, setChats] = useState<ChatInterface[]>([]);
  const { id } = useParams();

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

  useEffect(() => {
    authAxios(
      true,
      ApiEndpoints.getUserChats(`?archived=${archived}`),
      "GET"
    ).then((response) => {
      setChats(response?.data?.data?.chats);
    });
  }, [archived]);

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
        className={`chat-sidebar-content position-fixed overflow-y-auto alt-bg p-3 sidebar border-top`}
      >
        <div className="controls d-flex gap-2 mb-3">
          <Button
            onClick={() => setArchived(false)}
            className={`bg-transparent border ${
              archived === false && "main-btn"
            }`}
          >
            {t("chatSidebar.messages")}
          </Button>
          <Button
            onClick={() => setArchived(true)}
            className={`bg-transparent border ${
              archived === true && "main-btn"
            }`}
          >
            {t("chatSidebar.archived")}
          </Button>
        </div>

        {!chats.length && (
          <p className="fw-bold fs-3 text-center">
            {t("chatSidebar.noMessages")}
          </p>
        )}
        {chats?.map((chat) => {
          return <ChatLink key={chat._id} chat={chat} activeChat={id} />;
        })}
      
      </Col>
    </>
  );
};

export default ChattingSidebar;

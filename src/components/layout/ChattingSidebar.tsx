import { useEffect, useRef, useState } from "react";
import { Button, Col, Spinner } from "react-bootstrap";
import Icon from "../utils/Icon";
import { useRecoilState, useRecoilValue } from "recoil";
import { languageState } from "../../recoil/utils";
import { useTranslation } from "react-i18next";
import authAxios from "../../api/authAxios";
import { ApiEndpoints } from "../../api/ApiEndpoints";
import { useParams, useSearchParams } from "react-router-dom";
import ChatLink from "../Chat/ChatLink";
import { socket } from "../../sockets/socket.config";
import { archivedAtom, blockedAtom, chatsAtom } from "../../recoil/chatAtom";
import { ChatInterface } from "../../interfaces/interfaces";
import useLoggedInUser from "../../hooks/useLoggedInUser";

const ChattingSidebar = () => {
  const [iconName, setIconName] = useState<
    "mdi:arrow-right" | "mdi:arrow-left"
  >("mdi:arrow-right");
  const iconRef = useRef<HTMLSpanElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLElement>(null);
  const lang = useRecoilValue(languageState);
  const [chats, setChats] = useRecoilState(chatsAtom);
  const [loading, setLoading] = useState(true);
  const [archived, setArchived] = useRecoilState(archivedAtom);
  const [blocked, setBlocked] = useRecoilState(blockedAtom);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFirst, setIsFirst] = useState(true);
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useLoggedInUser();

  // Initialize state from query parameters
  useEffect(() => {
    const archivedParam = searchParams.get("archived");
    const blockedParam = searchParams.get("blocked");
    setArchived(archivedParam === "true");
    setBlocked(blockedParam === "true");
    setIsFirst(false);
  }, [searchParams]);

  // Handle socket notifications
  useEffect(() => {
    const handleReceivedMessage = (chatMessage: ChatInterface) => {
      setChats((prevChats) => {
        const chatExists = prevChats.some(
          (chat) => chat._id === chatMessage._id
        );
        if (archived && !blocked) {
          if (chatMessage?.archivedBy?.includes(user._id)) {
            // إذا كانت المحادثة موجودة، حدثها
            if (chatExists) {
              return prevChats
                .map((chat) =>
                  chat._id === chatMessage._id ? chatMessage : chat
                )
                .sort((a, b) => {
                  const date1 = new Date(
                    b.chat?.lastMessage?.createdAt || 0
                  ).getTime();
                  const date2 = new Date(
                    a.chat?.lastMessage?.createdAt || 0
                  ).getTime();
                  return date1 - date2;
                });
            } else {
              // إذا لم تكن المحادثة موجودة، أضفها
              return [...prevChats, chatMessage].sort((a, b) => {
                const date1 = new Date(
                  b.chat?.lastMessage?.createdAt || 0
                ).getTime();
                const date2 = new Date(
                  a.chat?.lastMessage?.createdAt || 0
                ).getTime();
                return date1 - date2;
              });
            }
          } else {
            // إذا كانت المحادثة غير مؤرشفة ولكن القائمة تعرض المؤرشفة، تجاهلها
            return prevChats;
          }
        } else if (!archived && !blocked) {
          // إذا كانت القائمة تعرض المحادثات غير المؤرشفة
          if (!chatMessage?.archivedBy?.includes(user._id)) {
            // إذا كانت المحادثة موجودة، حدثها
            if (chatExists) {
              return prevChats
                .map((chat) =>
                  chat._id === chatMessage._id ? chatMessage : chat
                )
                .sort((a, b) => {
                  const date1 = new Date(
                    b.chat?.lastMessage?.createdAt || 0
                  ).getTime();
                  const date2 = new Date(
                    a.chat?.lastMessage?.createdAt || 0
                  ).getTime();
                  return date1 - date2;
                });
            } else {
              // إذا لم تكن المحادثة موجودة، أضفها
              return [...prevChats, chatMessage].sort((a, b) => {
                const date1 = new Date(
                  b.chat?.lastMessage?.createdAt || 0
                ).getTime();
                const date2 = new Date(
                  a.chat?.lastMessage?.createdAt || 0
                ).getTime();
                return date1 - date2;
              });
            }
          } else {
            // إذا كانت المحادثة مؤرشفة ولكن القائمة تعرض غير المؤرشفة، تجاهلها
            return prevChats;
          }
        } else {
          return prevChats;
        }
      });
    };

    socket.on("receivedMessage", handleReceivedMessage);

    return () => {
      socket.off("receivedMessage", handleReceivedMessage);
    };
  }, [chats, user]);

  // Remove duplicated chats
  useEffect(() => {
    const uniqueChats = chats.filter(
      (chat, index, self) =>
        chat._id && self.findIndex((c) => c._id === chat._id) === index
    );

    if (uniqueChats.length !== chats.length) {
      setChats(uniqueChats);
    }
  }, [chats]);

  // Update icon based on language
  useEffect(() => {
    setIconName(lang === "ar" ? "mdi:arrow-left" : "mdi:arrow-right");
    iconRef.current?.classList.remove("show");
    sidebarRef.current?.classList.remove("show");
  }, [lang]);

  // Handle button clicks
  const handleButtonClick = (isArchived: boolean, isBlocked: boolean) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("archived", isArchived ? "true" : "false");
    newSearchParams.set("blocked", isBlocked ? "true" : "false");
    setSearchParams(newSearchParams);

    setArchived(isArchived);
    setBlocked(isBlocked);
  };

  // Fetch chats when `archived` or `blocked` changes
  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const response = await authAxios(
          true,
          ApiEndpoints.getUserChats(`?archived=${archived}&blocked=${blocked}`),
          "GET"
        );
        setChats(response?.data?.data?.chats);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setLoading(false);
      }
    };
    if (!isFirst) {
      fetchChats();
    }
  }, [isFirst, archived, blocked]);

  // Toggle sidebar visibility
  const handleClick = () => {
    iconRef.current?.classList.toggle("show");
    sidebarRef.current?.classList.toggle("show");
    setIconName((prevIcon) =>
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
            setIconName((prevIcon) =>
              prevIcon === "mdi:arrow-right"
                ? "mdi:arrow-left"
                : "mdi:arrow-right"
            );
          }}
          className="overlay show"
        ></div>
      )}

      <span ref={iconRef} onClick={handleClick} className="arrow w-fit alt-btn">
        <Icon icon={iconName} />
      </span>
      <Col
        ref={sidebarRef}
        lg={3}
        className={`chat-sidebar-content position-fixed overflow-y-auto alt-bg p-3 sidebar border-top`}
      >
        <div className="controls d-flex gap-2 mb-3">
          <Button
            onClick={() => handleButtonClick(false, false)}
            className={`bg-transparent border ${
              !archived && !blocked ? "main-btn" : ""
            }`}
            title={t("chatSidebar.messages")}
          >
            <Icon icon="humbleicons:chats" />
          </Button>
          <Button
            onClick={() => handleButtonClick(true, false)}
            className={`bg-transparent border ${
              archived && !blocked ? "main-btn" : ""
            }`}
            title={t("chatSidebar.archived")}
          >
            <Icon icon="material-symbols:archive-outline" />
          </Button>
          <Button
            onClick={() => handleButtonClick(false, true)}
            className={`bg-transparent border ${blocked ? "main-btn" : ""}`}
            title={t("chatSidebar.block")}
          >
            <Icon icon="material-symbols:block" />
          </Button>
        </div>

        {loading && (
          <div className="d-flex justify-content-center">
            <Spinner className="text-light" />
          </div>
        )}

        {!chats?.length && (
          <p className="fw-bold fs-3 text-center">
            {t("chatSidebar.noMessages")}
          </p>
        )}

        {chats?.map((chat, index) => (
          <ChatLink key={index} chat={chat} activeChat={id} />
        ))}
      </Col>
    </>
  );
};

export default ChattingSidebar;

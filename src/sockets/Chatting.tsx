import React, { useEffect, useRef, useState } from "react";
import { Container, Form, Button, InputGroup, Dropdown } from "react-bootstrap";
import { socket } from "./socket.config";
import { useNavigate, useParams } from "react-router-dom";
import useLoggedInUser from "../hooks/useLoggedInUser";
import notify from "../components/utils/Notify";
import authAxios from "../api/authAxios";
import { ApiEndpoints } from "../api/ApiEndpoints";
import { ChatInterface, Message } from "../interfaces/interfaces";
import Icon from "../components/utils/Icon";
import { useRecoilState, useRecoilValue } from "recoil";
import { receiverAtom } from "../recoil/receiverAtom";
import { useTranslation } from "react-i18next";
import { blockedAtom, chatsAtom, currentChatAtom } from "../recoil/chatAtom";
import { ChatAvatar } from "../components/Chat/ChatAvatar";
import { formatTo12 } from "../utils/formatTo12";

const Chatting = () => {
  const [message, setMessage] = useState<Message>({ content: "", sender: "" });
  const [chat, setChat] = useState<Message[]>([]);
  const [receiver, setReceiver] = useRecoilState(receiverAtom);
  const { user: loggedUser } = useLoggedInUser();
  const { id: receivedUserId } = useParams();
  const navigate = useNavigate();
  const chatBox = useRef<any>(0);
  const { t } = useTranslation();
  const [chats, setChats] = useRecoilState(chatsAtom);
  const [isLoadChats, setIsLoadChats] = useState(false);
  const [currentChat, setCurrentChat] = useRecoilState(currentChatAtom);
  const [firstChat, setFirstChat] = useState<ChatInterface>({});
  const blocked = useRecoilValue(blockedAtom);

  useEffect(() => {
    setCurrentChat(firstChat);
  }, [firstChat]);

  const handleNotValidUser = () => {
    notify("invalid page", "error", 1500);
    setTimeout(() => {
      navigate("/");
    }, 1500);
    return false;
  };

  useEffect(() => {
    if (chats.length) {
      setIsLoadChats(true);
    }
  }, [chats]);

  useEffect(() => {
    const currentChat = chats.find((item) => item.chat?._id == receivedUserId);
    setCurrentChat(currentChat || {});
  }, [isLoadChats, receivedUserId]);

  useEffect(() => {
    // Scroll down to the last message
    if (chatBox.current) {
      chatBox.current.scrollTop = chatBox.current.scrollHeight;
    }
  }, [chat]);

  useEffect(() => {
    const checkIdParamsIsValid = async (id: string) => {
      if (id === JSON.parse(sessionStorage.getItem("user") as any)._id) {
        return handleNotValidUser();
      }

      const response = await authAxios(true, ApiEndpoints.isExistUser(id));
      if (response.status === 200) {
        setReceiver(response.data.data.user);
      } else {
        return handleNotValidUser();
      }
    };

    checkIdParamsIsValid(receivedUserId as string);

    const getChatMessages = async (receivedUserId: string) => {
      const response = await authAxios(
        true,
        ApiEndpoints.getChatMessage(receivedUserId),
        "GET"
      );
      if (response.status === 200) {
        setChat(response?.data?.data?.messages);
      }
    };

    getChatMessages(receivedUserId as string);
  }, [receivedUserId]);

  useEffect(() => {
    if (
      (receiver.role === "user" && loggedUser.role === "user") ||
      (receiver.role === "owner" && loggedUser.role === "delivery") ||
      (receiver.role === "delivery" && loggedUser.role === "owner")
    ) {
      handleNotValidUser();
    }
  }, [receiver, loggedUser]);

  useEffect(() => {
    if (loggedUser?._id && receivedUserId) {
      socket.emit("startChat", { userId: loggedUser._id, receivedUserId });
    }

    socket.on("firstChat", (room) => {
      setFirstChat(room);
    });

    socket.on("message", (receivedMessage) => {
      setChat((prevChat) => [...prevChat, receivedMessage]);
    });
    
    socket.on("blocked", (data) => {
      if (data?.chat?._id == receivedUserId) {
        setCurrentChat((prev) => ({
          ...prev,
          blockedBy: [...(prev?.blockedBy || []), receivedUserId as any],
        }));
      }
    });

    socket.on("unBlocked", (data) => {
      if (data?.chat?._id == receivedUserId) {
        setCurrentChat((prev) => ({
          ...prev,
          blockedBy: prev?.blockedBy?.filter((item) => item != receivedUserId),
        }));
      }
    });

    return () => {
      socket.off("startChat");
      socket.off("firstChat");
      socket.off("message");
      socket.off("blocked");
      socket.off("unblocked");
    };
  }, [loggedUser, receivedUserId]);

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    message.sender = loggedUser._id;
    message.receiver = receivedUserId;
    socket.emit("message", message);

    // Update chats
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) => {
        if (chat?.chat?._id === receivedUserId) {
          return {
            ...chat,
            chat: {
              ...chat.chat,
              lastMessage: {
                ...chat.chat?.lastMessage,
                content: message.content,
                createdAt: new Date(),
                createdAtFormatted: formatTo12(),
              },
            },
          };
        }
        return chat;
      });

      // Sort chats by the last message creation time
      return updatedChats.sort(
        (a, b) =>
          new Date(b.chat?.lastMessage?.createdAt || 0).getTime() -
          new Date(a.chat?.lastMessage?.createdAt || 0).getTime()
      );
    });

    setMessage({
      content: "",
      sender: loggedUser?._id,
    });
  };

  const handleArchive = async () => {
    const response = await authAxios(
      true,
      ApiEndpoints.archive(currentChat?._id as string),
      "PUT"
    );
    if (response?.data?.success) {
      setChats((prev) => prev.filter((chat) => chat._id !== currentChat._id));
      setCurrentChat((prev) => ({
        ...prev,
        archivedBy: [...(prev.archivedBy || []), loggedUser._id],
      }));
    } else {
      notify(t("chatBox.archivedSuccess"), "success");
    }
  };

  const handleUnArchive = async () => {
    const response = await authAxios(
      true,
      ApiEndpoints.unarchive(currentChat?._id as string),
      "PUT"
    );
    if (response?.data?.success) {
      setChats((prev) => prev.filter((chat) => chat._id !== currentChat._id));
      setCurrentChat((prev) => ({
        ...prev,
        archivedBy: (prev.archivedBy || []).filter(
          (id) => id !== loggedUser._id
        ),
      }));
      notify(t("chatBox.unarchivedSuccess"), "success");
    } else {
      notify(t("chatBox.error"), "error");
    }
  };

  const handleBlock = async () => {
    socket.emit("block", {
      chat: currentChat,
      blocker: loggedUser._id,
      receiver: receivedUserId,
    });
    window.location.reload();
  };

  const handleUnBlock = async () => {
    socket.emit("unblock", {
      chat: currentChat,
      blocker: loggedUser._id,
      receiver: receivedUserId,
    });
    window.location.reload();
  };

  return (
    <Container className="chat">
      <div className="d-flex justify-content-between align-items-center px-3 main-bg-dark mt-3 py-2 text-light ">
        <div className="d-flex align-items-center gap-1">
          <ChatAvatar picture={receiver?.picture} name={receiver?.name} />
          <p className="mb-0 h4 text-truncate fw-bold">{receiver.name}</p>
        </div>
        <Dropdown>
          <Dropdown.Toggle
            className="no-arrow border-light px-1 py-1 bg-transparent"
            id="dropdown-basic"
          >
            <Icon icon="fluent:caret-down-20-regular" className="fs-2" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {!currentChat?.blockedBy?.length &&
              (currentChat?.archivedBy?.includes(loggedUser?._id) ? (
                <Dropdown.Item
                  onClick={handleUnArchive}
                  className="d-flex align-items-center gap-1"
                >
                  <Icon
                    icon="material-symbols:unarchive-outline"
                    className="fs-4"
                  />
                  {t("chatBox.unarchive")}
                </Dropdown.Item>
              ) : (
                <Dropdown.Item
                  onClick={handleArchive}
                  className="d-flex align-items-center gap-1"
                >
                  <Icon
                    icon="material-symbols:archive-outline"
                    className="fs-4"
                  />
                  {t("chatBox.archive")}
                </Dropdown.Item>
              ))}

            {(loggedUser?.role == "admin" ||
              !["user-admin", "admin-delivery", "admin-owner"].includes(
                currentChat?.chatType as string
              )) &&
              (currentChat?.blockedBy?.includes(loggedUser?._id) ? (
                <Dropdown.Item
                  onClick={handleUnBlock}
                  className="d-flex align-items-center gap-1"
                >
                  <Icon icon="material-symbols:block" className="fs-4" />
                  {t("chatBox.unblock")}
                </Dropdown.Item>
              ) : (
                <Dropdown.Item
                  onClick={handleBlock}
                  className="d-flex align-items-center gap-1"
                >
                  <Icon icon="material-symbols:block" className="fs-4" />
                  {t("chatBox.block")}
                </Dropdown.Item>
              ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div
        ref={chatBox}
        className="chat-box main-border-top main-border-start main-border-end p-2"
      >
        {chat.map((msg, index) => (
          <div
            className={`message-wrapper d-flex align-items-start gap-2 mb-2 p-2 ${
              msg.sender == loggedUser._id
                ? "sender justify-content-end"
                : "receiver"
            } `}
            key={index}
          >
            {msg.sender != loggedUser._id && (
              <ChatAvatar picture={receiver?.picture} name={receiver?.name} />
            )}
            <div
              className={` message text-light ${
                msg.sender == loggedUser._id
                  ? "sender main-bg-dark"
                  : "receiver bg-secondary"
              }`}
            >
              <p className="mb-0">{msg.content}</p>
              <p
                className="mb-0 d-flex justify-content-end"
                style={{ fontSize: "11px" }}
              >
                {msg.createdAtFormatted}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Form onSubmit={handleSendMessage}>
        {currentChat?.blockedBy?.length ? (
          currentChat?.blockedBy?.includes(loggedUser?._id) ? (
            <p className="mb-0 py-1 main-border text-center">
              {t("chatBox.youBlocked", { title: currentChat?.chat?.title })}
            </p>
          ) : (
            <p className="mb-0 py-1 main-border text-center">
              {t("chatBox.youHaveBeenBlocked", {
                title: currentChat?.chat?.title,
              })}
            </p>
          )
        ) : (
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Type a message..."
              value={message.content}
              onChange={(e) =>
                setMessage((prev) => ({ ...prev, content: e.target.value }))
              }
            />
            <InputGroup.Text className="bg-transparent rounded-0 main-border p-0">
              <Button type="submit" className="main-btn submit">
                <Icon icon="ic:outline-send" />
              </Button>
            </InputGroup.Text>
          </InputGroup>
        )}
      </Form>
    </Container>
  );
};

export default Chatting;

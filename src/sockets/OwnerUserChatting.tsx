import { useEffect, useRef, useState } from "react";
import { Container, Form, Button, InputGroup } from "react-bootstrap";
import { socket } from "./socket.config";
import { useNavigate, useParams } from "react-router-dom";
import useLoggedInUser from "../hooks/useLoggedInUser";
import notify from "../components/utils/Notify";
import authAxios from "../api/authAxios";
import { ApiEndpoints } from "../api/ApiEndpoints";
import { Message, UserInterface } from "../interfaces/interfaces";
import Icon from "../components/utils/Icon";

const OwnerUserChatting = () => {
  const [message, setMessage] = useState<Message>({ content: "", sender: "" });
  const [chat, setChat] = useState<Message[]>([]);
  const [receiver, setReceiver] = useState<UserInterface>({});
  const { user: loggedUser } = useLoggedInUser();
  const { id: receivedUserId } = useParams();
  const navigate = useNavigate();
  const chatBox = useRef<any>(0);

  useEffect(() => {
    // scroll down to last message
    if (chatBox.current) {
      chatBox.current.scrollTop = chatBox.current.scrollHeight;
    }
  }, [chat]);

  useEffect(() => {
    const handleNotValidUser = () => {
      notify("invalid page", "error", 1500);
      setTimeout(() => {
        navigate("/");
      }, 1500);
      return false;
    };

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
    if (loggedUser?._id && receivedUserId) {
      socket.emit("start_chat", { userId: loggedUser._id, receivedUserId });
    }

    socket.on("message", (receivedMessage) => {
      setChat((prevChat) => [...prevChat, receivedMessage]);
    });

    return () => {
      socket.off("message");
    };
  }, [loggedUser, receivedUserId]);

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    message.sender = loggedUser._id;
    socket.emit("message", message);
    setMessage({
      content: "",
      sender: loggedUser?._id,
    });
  };

  return (
    <Container className="chat">
      <div className="d-flex main-bg-dark mt-3 p-2 text-light ">
        <p className="mb-0 h4 text-truncate fw-bold">{receiver.name}</p>
        {/* options here */}
      </div>
      <div
        ref={chatBox}
        className="chat-box main-border-top main-border-start main-border-end p-2"
      >
        {chat.map((msg, index) => (
          <div
            className={`message-wrapper d-flex align-items-top gap-2 mb-2 p-2 ${
              msg.sender == loggedUser._id
                ? "sender justify-content-end"
                : "receiver"
            } `}
            key={index}
          >
            {msg.sender != loggedUser._id && (
              <div className="chat-avatar">
                {receiver?.picture ? (
                  <img src={receiver?.picture} alt={receiver?.name[0]} />
                ) : (
                  <div className="avatar d-flex justify-content-center align-items-center fs-5">
                    <Icon className="fs-1 text-light" icon="mdi:user" />
                  </div>
                )}
              </div>
            )}
            <div
              className={` message text-light ${
                msg.sender == loggedUser._id ? "sender main-bg-dark" : "receiver bg-secondary"
              }`}
            >
              <p className="mb-0">{msg.content}</p>
              <p className="mb-0 d-flex justify-content-end" style={{fontSize: "11px"}}>{msg.createdAtFormatted}</p>
            </div>
          </div>
        ))}
      </div>
      <Form onSubmit={handleSendMessage}>
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
      </Form>
    </Container>
  );
};

export default OwnerUserChatting;

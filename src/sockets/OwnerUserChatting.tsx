import { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { socket } from "./socket.config";
import { useNavigate, useParams } from "react-router-dom";
import useLoggedInUser from "../hooks/useLoggedInUser";
import notify from "../components/utils/Notify";
import authAxios from "../api/authAxios";
import { ApiEndpoints } from "../api/ApiEndpoints";
import { Message, UserInterface } from "../interfaces/interfaces";

const OwnerUserChatting = () => {
  const [message, setMessage] = useState<Message>({ content: "", sender: "" });
  const [chat, setChat] = useState<Message[]>([]);
  const [receiver, setReceiver] = useState<UserInterface>({});
  const { user: loggedUser } = useLoggedInUser();
  const { id: receivedUserId } = useParams();
  const navigate = useNavigate();

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
    const getChatMessages =async (receivedUserId: string) => {
      const response = await authAxios(true, ApiEndpoints.getChatMessage(receivedUserId), 'GET')
      if(response.status===200){
        setChat(response?.data?.data?.messages)
      }
    }
    getChatMessages(receivedUserId as string)

  }, []);


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
    <Container>
      <h3>Chatting</h3>
      <div
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          maxHeight: "300px",
          overflowY: "auto",
        }}
      >
        {chat.map((msg, index) => (
          <div
            className={`${
              msg.sender == loggedUser._id ? "sender" : "receiver"
            }`}
            key={index}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <Form onSubmit={handleSendMessage}>
        <Form.Group>
          <Form.Control
            className="border-none"
            type="text"
            placeholder="Type a message..."
            value={message.content}
            onChange={(e) =>
              setMessage((prev) => ({ ...prev, content: e.target.value }))
            }
          />
        </Form.Group>
        <Button type="submit" variant="primary" style={{ marginTop: "10px" }}>
          Send
        </Button>
      </Form>
    </Container>
  );
};

export default OwnerUserChatting;

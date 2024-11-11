import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { socket } from "./socket.config";
import { useNavigate, useParams } from "react-router-dom";
import useLoggedInUser from "../hooks/useLoggedInUser";
import notify from "../components/utils/Notify";
import authAxios from "../api/authAxios";
import { ApiEndpoints } from "../api/ApiEndpoints";
// 66ca7b145a08477047d66881

const OwnerUserChatting = () => {
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<string[]>([]);
  const { user: loggedUser } = useLoggedInUser();
  const { id } = useParams();
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
      if (id === loggedUser?._id) {
        return handleNotValidUser();
      }
  
      const response = await authAxios(true, ApiEndpoints.isExistUser(id));
      if (response.status === 404) {
        return handleNotValidUser();
      }
    };

    checkIdParamsIsValid(id as string);
    
    

  }, [loggedUser]);

  useEffect(() => {
    socket.on("message", (receivedMessage) => {
      setChat((prevChat) => [...prevChat, receivedMessage]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    socket.emit("message", message);
    setMessage(""); // تفريغ الرسالة بعد إرسالها
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
          <div key={index}>{msg}</div>
        ))}
      </div>
      <Form onSubmit={handleSendMessage}>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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

import React from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ChatInterface } from "../../interfaces/interfaces";
import Icon from "../utils/Icon";

const ChatLink = ({
  chat,
  activeChat,
}: {
  chat: ChatInterface;
  activeChat: string | undefined;
}) => {
  return (
    <a
      className={`chat-link ${
        activeChat === chat.chat?._id ? "active" : ""
      } d-block py-2`}
      href={`/chat/${chat?.chat?._id as string}`}
    >
      <Row className="mx-0 align-items-center">
        <Col xs={2}>
          {chat.chat?.picture ? (
            <img
              className="avatar"
              src={chat.chat?.picture}
              alt={chat.chat?.title}
            />
          ) : (
            <div className="avatar d-flex justify-content-center align-items-center fs-5">
              <Icon className="fs-1 text-light" icon="mdi:user" />
            </div>
          )}
        </Col>
        <Col xs={10}>
          <div>
            <div className="d-flex justify-content-between text-light">
              <p className="mb-0 fw-bold name"> {chat.chat?.title} </p>
              <p className="mb-0 ">
                {" "}
                {chat.chat?.lastMessage?.createdAtFormatted}{" "}
              </p>
            </div>
            <div className="text-truncate text-light">
              {chat.chat?.lastMessage?.content}
            </div>
          </div>
        </Col>
      </Row>
    </a>
  );
};

export default ChatLink;

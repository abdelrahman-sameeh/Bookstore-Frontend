import React from "react";
import Icon from "../utils/Icon";

export const ChatAvatar = React.memo(
  ({
    classes = "",
    picture,
    name,
  }: {
    classes?: string;
    picture?: string;
    name?: string;
  }) => (
    <div className={`chat-avatar border rounded-full main-bg ${classes}`}>
      {picture ? (
        <img src={picture} alt={name?.[0]} />
      ) : (
        <div className="avatar d-flex justify-content-center align-items-center fs-5">
          <Icon className="fs-1 text-light" icon="mdi:user" />
        </div>
      )}
    </div>
  )
);

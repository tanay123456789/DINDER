import React from "react";
import PropTypes from "prop-types";
import s from "./styles.module.css";
import { auth } from "../../../../firebase";

const Message = ({ message }) => {
  let classNames =
    message.author === auth.currentUser.uid
      ? `${s.container} ${s.sent}`
      : `${s.container} ${s.received}`;

  return (
    <div className={classNames}>
      <p>{message.body}</p>
    </div>
  );
};

export default Message;

Message.propTypes = {
  message: PropTypes.shape({
    author: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }),
};

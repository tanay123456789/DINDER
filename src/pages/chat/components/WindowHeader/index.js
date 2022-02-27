import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { ChatContext } from "../../../../context/chatContext";
import s from "./styles.module.css";

const WindowHeader = () => {
  const { selectedUser: user, toggleUsersPannel } = useContext(ChatContext);

  return (
    <div className={s.container}>
      <BiMenu className={s.icon} onClick={toggleUsersPannel} />
      <img src={user.photoURL} alt={user.displayName} />
      <Link to={`/users/${user.username}`}>
        <h3 className="user-name">{user.displayName}</h3>
      </Link>
    </div>
  );
};

export default WindowHeader;

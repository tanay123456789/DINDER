import React, { useContext } from "react";
import { Link } from "react-router-dom";
import s from "./styles.module.css";
import { BsChatDots } from "react-icons/bs";
import { AuthContext } from "../../context/authContext";

const Navigation = () => {
  const { user } = useContext(AuthContext);
  return (
    <nav className={s.nav}>
      <ul>
        <li className={s.brand}>
          <Link to="/">
            <h1>DINDER</h1>
          </Link>
        </li>
        <li className={s.chat}>
          <Link to="/chat">
            <BsChatDots />
            <span>Chat</span>
          </Link>
        </li>
        <li>
          <Link to="/profile" className={s.user}>
            <img src={user.photoURL} alt={user.displayName} />
            <span>{user.displayName}</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default Navigation;

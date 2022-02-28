import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import s from "./styles.module.css";
import { BsChatDots } from "react-icons/bs";
import { VscSignOut } from "react-icons/vsc";
import { AuthContext } from "../../context/authContext";
import { auth } from "../../firebase";
import { BiMenu, BiUserCircle } from "react-icons/bi";
import { Drawer } from "artemis-ui";

const Navigation = () => {
  const { user, username } = useContext(AuthContext);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const hideDrawer = () => {
    setIsDrawerVisible(false);
  };

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const hanldeSignOut = () => {
    auth.signOut();
  };

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

        <li className={s.signout} onClick={hanldeSignOut}>
          <VscSignOut />
          Sign out
        </li>

        <li className={s.profile}>
          <Link to="/profile" className={s.user}>
            <img src={user.photoURL} alt={user.displayName} />
            <span>{username}</span>
          </Link>
        </li>

        <li onClick={showDrawer} className={s.menu}>
          <BiMenu style={{ fontSize: "1.8rem" }} />
        </li>
      </ul>

      <Drawer
        isVisible={isDrawerVisible}
        onClose={hideDrawer}
        placement="bottom"
        height="fit-content"
      >
        <Link to="/profile">
          <p className={s.drawerItem}>
            <BiUserCircle style={{ fontSize: "1.8rem" }} />
            Profile
          </p>
        </Link>
        <p className={s.drawerItem} onClick={hanldeSignOut}>
          <VscSignOut style={{ fontSize: "1.8rem" }} /> Sign out
        </p>
      </Drawer>
    </nav>
  );
};
export default Navigation;

import React, { useContext, Fragment } from "react";
import PropTypes from "prop-types";
import s from "./styles.module.css";
import { doc, query, collection, orderBy, limit } from "firebase/firestore";
import {
  useDocumentDataOnce,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { auth, db } from "../../../../firebase";
import Loader from "../../../../components/Loader";
import { ChatContext } from "../../../../context/chatContext";
import { getFormatedTimestamp } from "../../../../helpers";

const User = ({ data }) => {
  const {
    selectedChatId,
    setSelectedChatId,
    setSelectedUser,
    toggleUsersPannel,
  } = useContext(ChatContext);
  const { users } = data;
  const { chatId } = data;

  let active = chatId === selectedChatId;

  /**
   * users array have the uids of two connected user
   * so get the uid of user other than the authenticated one.
   */
  const uid = users.find((userId) => auth.currentUser.uid !== userId);

  const docRef = doc(db, "users", uid);
  const [user, isLoading, error] = useDocumentDataOnce(docRef);

  const chatDocRef = doc(db, "chats", chatId.trim());
  const q = query(
    collection(chatDocRef, "chats"),
    orderBy("createdAt", "desc"),
    limit(1)
  );

  const [recentMessage] = useCollectionData(q);

  const handleClick = () => {
    setSelectedChatId(chatId.trim());
    setSelectedUser(user);
    toggleUsersPannel();
  };

  if (isLoading) {
    // FIXME: show a skeleton instead of a loader
    return (
      <div className={s.container}>
        <Loader show />
      </div>
    );
  }
  if (!user || error) {
    return null;
  }

  return (
    <div
      className={active ? s.containerActive : s.container}
      onClick={handleClick}
    >
      <img src={user.photoURL} alt="" className={s.img} />
      <div className={s.user}>
        <p className={s.name}>{user.displayName}</p>

        {recentMessage && recentMessage.length > 0 && (
          <Fragment>
            <p className={s.lastMessage}>{recentMessage[0].body}</p>
            <span>{getFormatedTimestamp(recentMessage[0].createdAt)}</span>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default User;

User.propTypes = {
  data: PropTypes.shape({
    chatId: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.string),
  }),
};

import React, { useState, createContext } from "react";
import PropTypes from "prop-types";

import { collection, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";

export const ChatContext = createContext();

export default function ChatProvider(props) {
  const [isUsersVisible, setIsUsersVisible] = useState(false);

  const toggleUsersPannel = () => {
    setIsUsersVisible((prevState) => !prevState);
  };

  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const q = query(
    collection(db, "chats"),
    where("users", "array-contains", auth.currentUser.uid)
  );
  const [chats, loading] = useCollectionDataOnce(q);
  
  return (
    <ChatContext.Provider
      value={{
        chats,
        loading,
        selectedChatId,
        selectedUser,
        isUsersVisible,
        setSelectedChatId,
        setSelectedUser,
        toggleUsersPannel,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
}

ChatProvider.propTypes = {
  children: PropTypes.element,
};

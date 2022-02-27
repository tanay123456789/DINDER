import Message from "../Message";
import React, { useContext } from "react";
import { ChatContext } from "../../../../context/chatContext";
import { collection, doc, query, orderBy } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import s from "./styles.module.css";

const ChatWindow = () => {
  const { selectedChatId: chatId } = useContext(ChatContext);

  const chatDocRef = doc(db, "chats", chatId);

  const q = query(
    collection(chatDocRef, "chats"),
    orderBy("createdAt", "desc")
  );

  const [messages, error] = useCollectionData(q);

  if (error) {
    return <div className={s.container}></div>;
  }

  return ( 
    <div className={s.container}>
      {messages &&
        messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
    </div>
  );
};

export default ChatWindow;

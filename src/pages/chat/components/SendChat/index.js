import React, { useContext, useState } from "react";
import s from "./styles.module.css";
import { toast } from "react-hot-toast";
import { ChatContext } from "../../../../context/chatContext";
import { collection, addDoc, doc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../../../firebase";

const SendChat = () => {
  const { selectedChatId: chatId } = useContext(ChatContext);

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = message.trim();

    if (val.length === 0) {
      return toast.error("Please write something");
    }

    try {
      const docRef = doc(db, "chats", chatId);
      const c = collection(docRef, "chats");

      await addDoc(c, {
        body: message,
        author: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      setMessage("");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form className={s.container} onSubmit={handleSubmit}>
      <input
        type="text"
        name="message"
        placeholder="Type a message"
        autoComplete="off"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button disabled={!message}>Send </button>
    </form>
  );
};

export default SendChat;

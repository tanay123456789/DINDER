import React, { useContext, Fragment } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import User from "./components/User";
import WindowHeader from "./components/WindowHeader";
import SendChat from "./components/SendChat";
import ChatWindow from "./components/ChatWindow";
import s from "./styles.module.css";
import { AiOutlineMessage } from "react-icons/ai";
import Loader from "../../components/Loader";
import { ChatContext } from "../../context/chatContext";

const ChatPage = () => {
  const { loading, chats } = useContext(ChatContext);

  if (loading) {
    return (
      <main className="box-center" style={{ height: "calc(100vh - 4rem)" }}>
        <Loader show />
      </main>
    );
  }

  if (!chats || chats.length === 0) {
    return (
      <main className="box-center" style={{ height: "calc(100vh - 4rem)" }}>
        <h4 style={{ textAlign: "center" }}>
          When you match with others, <br />
          You can send them a message under chats.
        </h4>
      </main>
    );
  }

  return (
    <main className={s.container}>
      <UsersPanel />
      <ChatPanel />
    </main>
  );
};

export default ChatPage;

function UsersPanel() {
  const { chats, toggleUsersPannel, isUsersVisible } = useContext(ChatContext);
  let classNames = isUsersVisible
    ? `${s.usersPanel} ${s.active}`
    : `${s.usersPanel}`;

  return (
    <div className={classNames}>
      <div className={s.search}>
        {/*TODO: Add a search feature here*/}
        <AiOutlineArrowLeft
          className={s.backIcon}
          onClick={toggleUsersPannel}
        />
        <h3>Chats</h3>
      </div>
      <div className={s.users}>
        {chats && chats.map((chat) => <User key={chat.chatId} data={chat} />)}
      </div>
    </div>
  );
}

function ChatPanel() {
  const { toggleUsersPannel, selectedChatId } = useContext(ChatContext);

  return (
    <div className={s.chatPanel}>
      {selectedChatId ? (
        <Fragment>
          <WindowHeader />
          <ChatWindow />
          <SendChat />
        </Fragment>
      ) : (
        <div className={s.placeholder}>
          <div>
            <AiOutlineMessage />
          </div>
          <p onClick={toggleUsersPannel}>Select a user</p>
        </div>
      )}
    </div>
  );
}

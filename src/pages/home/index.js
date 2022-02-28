import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import s from "./styles.module.css";
import TinderCard from "react-tinder-card";
import {
  arrayUnion,
  arrayRemove,
  collection,
  doc,
  query,
  updateDoc,
  setDoc,
  where,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { nanoid } from "nanoid";
import Loader from "../../components/Loader";
import { BsInfoCircle } from "react-icons/bs";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Confetti from "./components/Confetti";
import { toast } from "react-hot-toast";

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const { userDoc } = useContext(AuthContext);
  const { swipes, passes, connected } = userDoc;
  const hiddenUsers = [...swipes, ...passes, ...connected];

  const q = query(
    collection(db, "users"),
    where("uid", "!=", auth.currentUser.uid)
  );

  const [allUsers, isLoading] = useCollectionData(q);

  useEffect(() => {
    if (allUsers && allUsers.length > 0) {
      const filteredUser = allUsers.filter(
        (user) => !hiddenUsers.some((uid) => uid === user.uid)
      );
      setUsers(filteredUser);
    }
  }, [allUsers]);

  const congratulate = (user) => {
    setShowConfetti(true);
    toast(`Congratulations you connected with ${user.displayName}`, {
      style: {
        width: "40rem",
        fontWeight: "bold",
      },
      icon: "🤝",
    });
  };

  const initializeChat = async (uid1, uid2) => {
    const chatId = nanoid();
    const chatsRef = doc(db, "chats", chatId);
    await setDoc(chatsRef, {
      users: [uid1, uid2],
      createdAt: Timestamp.now(),
      chatId,
    });
  };

  /**
   * check if already swiped by the other user
   * if yes then and swiped user to `connected`
   * else add to `swipes`
   *
   **/
  const handleRightSwipe = async (uid) => {
    try {
      const { currentUser } = auth;

      const swipedUserDocRef = doc(db, "users", uid);
      const loggedUserDocRef = doc(db, "users", currentUser.uid);

      const swipedUser = await getDoc(swipedUserDocRef);
      const swipes = swipedUser.data().swipes;

      const isAlreadySwiped = swipes.some((uid) => uid === currentUser.uid);

      if (isAlreadySwiped) {
        // add swiped user in connected arr of logged in user
        await updateDoc(loggedUserDocRef, {
          connected: arrayUnion(uid),
        });

        // add logged user in connected arr of swiped user
        // and remove the logged in user from swipes array
        await updateDoc(swipedUserDocRef, {
          connected: arrayUnion(currentUser.uid),
          swipes: arrayRemove(currentUser.uid),
        });

        // initialize the chat
        await initializeChat(currentUser.uid, uid);
        // congratulate the user
        congratulate(swipedUser.data());
      } else {
        // just update the logged in user's doc
        await updateDoc(loggedUserDocRef, {
          swipes: arrayUnion(uid),
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleLeftSwipe = async (uid) => {
    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        passes: arrayUnion(uid),
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleSwipe = async (direction, uid) => {
    if (direction === "left") {
      await handleLeftSwipe(uid);
    } else if (direction === "right") {
      console.log("RIGHT");
      await handleRightSwipe(uid);
    }
  };

  if (isLoading || !users)
    return (
      <main className={s.container}>
        <Loader show />
      </main>
    );

  return (
    <main className={s.container}>
      <Confetti showConfetti={showConfetti} setShowConfetti={setShowConfetti} />
      {users.length > 0 ? (
        <div className={s.cardContainer}>
          {users.map((user) => (
            <SwipeableCard
              user={user}
              key={user.uid}
              onSwipe={(direction) => handleSwipe(direction, user.uid)}
              preventSwipe={["up", "down"]}
            />
          ))}
        </div>
      ) : (
        <h2>cannot find more users</h2>
      )}
    </main>
  );
};

export default HomePage;

const SwipeableCard = ({ user, ...props }) => {
  return (
    <TinderCard className={s.swipeable} {...props}>
      <div
        className={s.card}
        style={{
          backgroundImage: `url(${user.photoURL})`,
        }}
      >
        <div className={s.info}>
          <Link to={`/users/${user.username}`}>
            <h3>{user.displayName}</h3>
            <span>
              <BsInfoCircle />
            </span>
          </Link>
        </div>
      </div>
    </TinderCard>
  );
};

SwipeableCard.propTypes = {
  user: PropTypes.object,
};

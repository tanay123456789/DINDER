import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

/**
 * a hook to read auth record and read user doc
 * it returns the authenticated user,
 *  username and user document
*/
const useUserData = () => {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [userDoc, setUserDoc] = useState(null);

  useEffect(() => {
    // stop listening to realtime subscription
    let unsubscribe;

    if (user) {
      const docRef = doc(db, "users", user.uid);

      unsubscribe = onSnapshot(docRef, (doc) => {
        setUsername(doc.data()?.username);
        setUserDoc(doc.data());
      });
    } else {
      setUsername(null);
    }
    return unsubscribe;
  }, [user]);

  return { user, username, userDoc };
};

export default useUserData;

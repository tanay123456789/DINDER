import React, {
  Fragment,
  useEffect,
  useCallback,
  useState,
  useContext,
} from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import { AuthContext } from "../../context/authContext";
import debounce from "lodash.debounce";

// firebase imports
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, githubProvider, batch, db } from "../../firebase";

// style
import s from "./styles.module.css";

/**
 * if logged and have username in rediret to previous location
 * if user is not logged in then show signin button
 * logged inbut doesnot have username then show username form
 */
const SigninPage = () => {
  const { user, username } = useContext(AuthContext);

  /**
   * get the pathname from where user came
   * redirect to previous path if availabe
   * or redirect to home if authentication is done
   */

  const { search } = useLocation();
  const to = search.split("=")[1];

  if (username) {
    return <Navigate to={to ? to : "/"} />;
  }
  return (
    <Fragment>
      <main>
        {user ? (
          !username ? (
            <UsernameForm />
          ) : (
            <SignOutButton />
          )
        ) : (
          <SignInButton />
        )}
      </main>
    </Fragment>
  );
};

export default SigninPage;

function SignInButton() {
  const hanldeSignIn = async () => {
    await signInWithPopup(auth, githubProvider);
  };
  return (
    <button className={s.btn} onClick={hanldeSignIn}>
      Sign in with Github
    </button>
  );
}
function SignOutButton() {
  const hanldeSignOut = async () => {
    await auth.signOut();
  };
  return (
    <button className={s.btn} onClick={hanldeSignOut}>
      Sign out
    </button>
  );
}

// Username form
function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(AuthContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDocRef = doc(db, "users", user.uid);
    const usernameDocRef = doc(db, "usernames", formValue);

    // Commit both docs together as a batch write.
    batch.set(userDocRef, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
      uid: user.uid,
      githubUID: user.providerData[0].uid,
      projects: [],
    });
    batch.set(usernameDocRef, {
      uid: user.uid,
      githubUID: user.providerData[0].uid,
    });

    await batch.commit();
  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  //

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(db, "username", username);
        const docSnap = await getDoc(ref);
        console.log("Firestore read executed!");
        const exists = docSnap.exists();
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section style={{ paddingTop: "2rem" }}>
        <h3>Choose Username</h3>
        <span
          style={{ marginBottom: "1rem", display: "block", fontSize: "0.8rem" }}
        >
          Usernames cannot be changed later.
        </span>
        <form
          onSubmit={onSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
        >
          <input
            name="username"
            placeholder="myname"
            value={formValue}
            onChange={onChange}
            autoComplete="off"
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}

UsernameMessage.propTypes = {
  username: PropTypes.string,
  isValid: PropTypes.bool,
  loading: PropTypes.bool,
};

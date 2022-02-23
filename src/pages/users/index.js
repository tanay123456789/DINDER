/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import s from "../profile/styles.module.css";
import ProfileCard from "../../components/ProfileCard";
import Projects from "../../components/Projects";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const UserPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const [userId, setUserId] = useState("");
  const [githubData, setGithubData] = useState({});

  const fetchData = async () => {
    try {
      const docRef = doc(db, "usernames", username);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserId(docSnap.data().uid);

        // fetch githubData
        const githubURL = `https://api.github.com/user/${
          docSnap.data().githubUID
        }`;
        const res = await axios.get(githubURL);
        setGithubData(res.data);
      } else {
        navigate("/not-found");
      }
      //  document does not exist redirect to 404 page.
    } catch (error) {
      navigate("/not-found");
      console.log(error);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [username]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Cannot find the user...</p>;
  return (
    <main className={s.container}>
      <ProfileCard data={githubData} />
      <div className={s.containerTwo}>
        <div className={s.projects}>
          <h2>Projects</h2>
          <div className={s.projectItems}>
            <Projects uid={userId} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserPage;

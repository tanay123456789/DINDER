import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import ProjectItem from "./ProjectItem";

/**
 * @author Rishu Patel
 * @param {string} uid - a users's uid generated from firebass
 * @returns {array} an array of `<ProjectItem/>` components
 */
const Projects = ({ uid }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const docRef = doc(db, "users", uid);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      setProjects(doc.data().projects);
    });

    return unsubscribe;
  }, [uid]);

  return projects.map((project) => (
    <ProjectItem key={project.id} data={project} />
  ));
};

export default Projects;

Projects.propTypes = {
  uid: PropTypes.string.isRequired,
};

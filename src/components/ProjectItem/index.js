import PropTypes from "prop-types";
import React from "react";
import { FiExternalLink } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { db, auth } from "../../firebase";
import { doc, arrayRemove, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

// styles
import s from "./styles.module.css";

const ProjectItem = ({ data }) => {
  const deleteProject = async () => {
    const toastId = toast.loading("Deleting...");
    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        projects: arrayRemove(data),
      });
      toast.success("Project deleted successfully.", { id: toastId });
    } catch (error) {
      console.log(error);
      toast.error("Unable to deleted project successfully.", { id: toastId });
    }
  };
  return (
    <div className={s.item}>
      <div>
        <img src={data.thumbnailURL} alt={data.name} />
      </div>
      <h3>{data.name}</h3>
      <p>{data.description}</p>
      <div className={s.actions}>
        <a href={data.demoURL} target="_blank" rel="noreferrer">
          <strong>
            <em>
              demo <FiExternalLink />
            </em>
          </strong>
        </a>
        <a href={data.githubURL} target="_blank" rel="noreferrer">
          <strong>
            <em>
              github <FiExternalLink />
            </em>
          </strong>
        </a>
      </div>
      {auth.currentUser.uid === data.uid && (
        <div className={s.del} onClick={deleteProject}>
          <MdDeleteOutline />
        </div>
      )}
    </div>
  );
};

export default ProjectItem;

ProjectItem.propTypes = {
  data: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    githubURL: PropTypes.string.isRequired,
    demoURL: PropTypes.string.isRequired,
    thumbnailURL: PropTypes.string.isRequired,
    projectNumber: PropTypes.number,
  }),
};

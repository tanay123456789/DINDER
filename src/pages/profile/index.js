import React, { Fragment, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AiOutlinePlus } from "react-icons/ai";
import { Drawer, Input, Button, TextArea } from "artemis-ui";
import { Formik, Form } from "formik";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, auth, db } from "../../firebase";
import { doc, updateDoc, Timestamp, arrayUnion } from "firebase/firestore";
import { toast } from "react-hot-toast";
import * as Yup from "yup";
import { nanoid } from "nanoid";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import ProfileCard from "../../components/ProfileCard";
import Projects from "../../components/Projects";
// styles
import s from "./styles.module.css";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [githubData, setGithubData] = useState({});

  const fetchUser = async () => {
    const res = await axios.get(
      `https://api.github.com/user/${user.providerData[0].uid}`
    );
    setGithubData(res.data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <main className={s.container}>
      <ProfileCard data={githubData} />
      <div className={s.containerTwo}>
        <div className={s.projects}>
          <h2>Projects</h2>
          <div className={s.projectItems}>
            <AddNewProject />
            <Projects uid={user.uid} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;

const AddNewProject = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };
  const hideModal = () => {
    setIsModalVisible(false);
  };

  return (
    <Fragment>
      <NewProjectForm isModalVisible={isModalVisible} hideModal={hideModal} />
      <div className={s.add} onClick={showModal}>
        <AiOutlinePlus className={s.addIcon} />
        <h4>Add a new project</h4>
        <p>
          <em>
            The project images are shown to other users based on which they
            decide whether or not to connect with you.
          </em>
        </p>
      </div>
    </Fragment>
  );
};

const NewProjectForm = ({ isModalVisible, hideModal }) => {
  const [photo, setPhoto] = useState({});

  const initialFormikValues = {
    name: "",
    githubURL: "",
    demoURL: "",
    thumbnailURL: "",
    description: "",
    projectNumber: 0,
  };

  // schema for form validation
  const projectSchema = Yup.object().shape({
    name: Yup.string()
      .min(4, "Project name is too short")
      .max(50, "Projct name is too long")
      .required("Project name is required"),
    description: Yup.string()
      .min(10, "Description  is too short")
      .max(150, "Description is too long"),
    githubURL: Yup.string()
      .url("Github URL must be a valid URL")
      .required("Github URL is required"),
    demoURL: Yup.string()
      .url("Demo must be a valid URL")
      .required("Demo URL is required"),
    projectNumber: Yup.number()
      .positive("Project number must be a positive number")
      .round(),
  });

  // handle onchange event on file input
  const onChangePicture = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const addProjectToDB = async (data, actions) => {
    const toastId = toast.loading("Uploading project");
    const docRef = doc(db, "users", auth.currentUser.uid);
    try {
      await updateDoc(docRef, {
        projects: arrayUnion(data),
      });
      toast.success("Project uploded successfully", { id: toastId });
      setPhoto(null);

      // reset the form
      actions.resetForm();
    } catch (error) {
      console.log(error);
      toast.error("Unable to upload project", { id: toastId });
    } finally {
      toast.dismiss(toastId);
      actions.setSubmitting(false);
    }
  };

  /**
   * - upload the file to firebase and get a download URL
   * - upload the data to the firestore
   **/
  const handleSubmit = async (values, actions) => {
    actions.setSubmitting(true);
    if (!photo) return toast.error("Please select an image.");
    const file = photo;
    const extension = file.type.split("/")[1];

    // Makes reference to the storage bucket location
    const storageRef = ref(
      storage,
      `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    );
    // set uploading flag to true
    const toastId = toast.loading("Uploading Image...");

    // Starts the upload
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "STATE_CHANGED",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        toast.loading(`Uploading Image ${progress.toFixed()}%`, {
          id: toastId,
        });
      },
      // handle errors
      (error) => {
        console.log("ERROR", error);
        console.log("CODE", error.code);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // dismiss the image uploading toast.
          toast.success("Image uploaded successfully", { id: toastId });
          //  add downloadURL to values object
          const projectData = {
            ...values,
            thumbnailURL: downloadURL,
            createdAt: Timestamp.now(),
            id: nanoid(),
            uid: auth.currentUser.uid,
          };
          // add data to DB
          addProjectToDB(projectData, actions);
        });
      }
    );
  };

  return (
    <Drawer
      placement="right"
      shape="rounded"
      isVisible={isModalVisible}
      onClose={hideModal}
      width="fit-content"
    >
      <Formik
        initialValues={initialFormikValues}
        validationSchema={projectSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, values, errors, touched }) => (
          <Form className={s.addProjectForm}>
            <Input
              label="Project Name"
              placeholder="What is your project called?"
              shape="rounded"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && errors.name ? errors.name : null}
            />
            <Input
              label="Github URL"
              placeholder="Add a link to you github repository."
              shape="rounded"
              name="githubURL"
              value={values.githubURL}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.githubURL && errors.githubURL ? errors.githubURL : null
              }
            />
            <Input
              label="Demo URL"
              placeholder="Add a link where people can see your project."
              shape="rounded"
              name="demoURL"
              value={values.demoURL}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.demoURL && errors.demoURL ? errors.demoURL : null}
            />
            <TextArea
              label="Short Description"
              placeholder="Add a short description for your projects in 150 words."
              shape="rounded"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              height="100px"
              error={
                touched.description && errors.description
                  ? errors.description
                  : null
              }
            />
            <Input
              type="number"
              label="Project Number (not required)"
              placeholder="A project with lower number is shown first."
              shape="rounded"
              name="projectNumber"
              value={values.projectNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.projectNumber && errors.projectNumber
                  ? errors.projectNumber
                  : null
              }
            />
            <input
              type="file"
              name="thumbnail"
              accept="image/x-png,image/gif,image/jpeg"
              onChange={onChangePicture}
            />
            <Button variant="primary" shape="rounded" type="submit">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
};

NewProjectForm.propTypes = {
  isModalVisible: PropTypes.bool,
  hideModal: PropTypes.func,
};

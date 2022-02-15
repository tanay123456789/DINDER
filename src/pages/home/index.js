import React from "react";
import image from "./mp.jpg";
import { FaTimes, FaCheck } from "react-icons/fa";
import "./home.css";

const HomePage = () => {
  /*const handleCase=()=>{

  }*/ //to handle the case when user swipe right or left

  return (
    <div>
      <div className="card">
        <div className="container">
          <img src={image} alt="user-image" width="60%" className="centerImg" />
          <h1>Username</h1>
          <p>Tags</p>
        </div>
      </div>
      <FaTimes className=""/>
      <FaCheck className=""/>
    </div>
  );
};

export default HomePage;

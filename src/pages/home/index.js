import React from "react";
import image from "./mp.jpg";
import "./home.css";

const HomePage = () => {

  return (

    <div className="card">
      <div className="container">
        <img src={image} alt="user-image" width="100%"/>
        <h2>Username</h2> 
        <p>Tags</p> 
      </div>
      
    </div>
    
  );
};

export default HomePage;









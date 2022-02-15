import React from "react";
import image from "./mp.jpg";
import { FaTimes, FaCheck } from "react-icons/fa";
import "./home.css";

/*const [userName,setUserName]=useState(null);

const [isSwipeRight,setSwipeRight]=useState(false);

const RejectedList=new Array.fill("empty",0);


const AcceptedList=new Array.fill("empty",0);
*/

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
      <FaTimes className="timeIcon"/>
      <FaCheck className="checkIcon"/>
    </div>
  );
};

export default HomePage;




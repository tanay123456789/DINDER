/* eslint-disable no-unused-vars */
import React, { useState } from "react";

//import { FaTimes, FaCheck } from "react-icons/fa";




import Card from "./Card";


import "./home.css";







/*const handleCase=()=>{

}*/ //to handle the case when user swipe right or left

/*<img src={image} alt="user-image" width="60%" className="centerImg" /> 
        <h1>Username</h1>
        <p>Tags</p>*/

const HomePage = () => {

  const [userName, setUserName] = useState(null);


  const [isSwipeRight, setSwipeRight] = useState(false);

  
  return(
    <Card/>






  );
  




  /*return(
    <div>
      <Card/>
      <FaTimes className="timeIcon" />
      <FaCheck className="checkIcon" />



    </div>

    

  );*/



 

      

           

          
          
          
        
      
    
  
};

export default HomePage;

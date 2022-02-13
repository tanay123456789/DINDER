import React from 'react';
import './App.css';
import {BrowserRouter as Router,Routes,Route,Link,Navigate} from "react-router-dom"
import Signin from './routes/Signin';
import Signup from './routes/Signup';
import HomePage from './routes/HomePage';
import UserProfile from './routes/UserProfile';
import PageNotFound from './routes/PageNotFound';
import Chat from './routes/Chat'
const App=()=> {
  return (
    <div className="App">
      <header className="App-header">
       <Router>
         <Routes>
         <Route exact path="/" element={<HomePage/>}/>
          <Route exact path="/signin" element={<Signin/>}/>
          <Route exact path="/signup" element={<Signup/>}/>
          <Route exact path="/profile" element={<UserProfile/>}/>
          <Route exact path="/chat" element={<Chat/>}/>
          <Route exact path="*" element={<PageNotFound/>}/>

         </Routes>
         
         
         </Router> 
      </header>
    </div>
  );
}

export default App;


















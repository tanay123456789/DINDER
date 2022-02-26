import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import Layout from "./components/Layout";

// pages
import HomePage from "./pages/home";
import ChatPage from "./pages/chat";
import ProfilePage from "./pages/profile";
import NotFound from "./pages/errors/NotFound";
import UserPage from "./pages/users";
import SigninPage from "./pages/signin";

// context
import AuthProvider from "./context/authContext";

// Toaster for notifications and alerts
import { Toaster } from "react-hot-toast";
import ChatProvider from "./context/chatContext";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />

            <Route
              path="chat"
              element={
                <ChatProvider>
                  <ChatPage />
                </ChatProvider>
              }
            />

            <Route path="profile" element={<ProfilePage />} />
            <Route path="users/:username" element={<UserPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/signin" element={<SigninPage />} />
        </Routes>
      </AuthProvider>
      <Toaster />
    </Router>
  );
};

export default App;

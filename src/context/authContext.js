import React, { createContext } from "react";
import PropTypes from "prop-types";
import useUserData from "../hooks/useUserData";

export const AuthContext = createContext({ user: null, username: null });

const AuthProvider = ({ children }) => {
  const userData = useUserData();

  return (
    <AuthContext.Provider value={userData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

AuthProvider.propTypes = {
  children: PropTypes.element,
};

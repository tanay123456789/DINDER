import React, { Fragment, useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useLocation } from "react-router-dom";

import Navigation from "./Navigation";

const Layout = () => {
  const { username } = useContext(AuthContext);

  /**
   * if user is not logged in then we get the `pathname` a user has requested
   * and pass it in the `to` prop of <Navigate/> then we can extract the `pathname`
   * in the signin page to redirect the user to requested path
   */
  let { pathname } = useLocation();

  if (!username) {
    return <Navigate to={`/signin?from=${pathname}`} />;
  }

  return (
    <Fragment>
      <Navigation />
      <Outlet />
    </Fragment>
  );
};

export default Layout;

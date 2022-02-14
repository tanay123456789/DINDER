import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

const Layout = () => {
  // TODO: Perform Auth check and redirect user to sign in if not authenticated
  return (
    <Fragment>
      <Navigation />
      <Outlet />
    </Fragment>
  );
};

export default Layout;

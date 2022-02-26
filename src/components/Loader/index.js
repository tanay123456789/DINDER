import React from "react";
import PropTypes from "prop-types";
import s from "./styles.module.css";

const Loader = ({ show }) => (show ? <div className={s.loader} /> : null);
export default Loader;

Loader.propTypes = {
  show: PropTypes.bool.isRequired,
};

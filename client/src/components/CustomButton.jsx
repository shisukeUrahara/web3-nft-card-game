import React from "react";
import styles from "../styles";

const CustomButton = ({ title, onClickHandler, restStyles }) => {
  return (
    <button
      type="button"
      className={`${styles.btn} ${restStyles}`}
      onClick={onClickHandler}
    >
      {title}
    </button>
  );
};

export default CustomButton;

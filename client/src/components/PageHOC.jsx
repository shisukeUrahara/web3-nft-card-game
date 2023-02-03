import React from "react";
import { useNavigate } from "react-router-dom";
import { logo, heroImg } from "../assets";
import styles from "../styles";

const PageHOC = (Component, title, description) => () => {
  return (
    <div className={styles.hocContainer}>
      <div class={styles.hocContentBox}>
        <img
          src={logo}
          alt="logo"
          className={styles.hocLogo}
          onClick={() => navigate("/")}
        />
        <div class={styles.hocBodyWrapper}>
          <div class="flex flex-row w-full">
            <h1 className={`flex ${styles.headText} head-text`}>{title}</h1>
            <p className={`${styles.normalText} my-10`}>{description}</p>

            <Component />
          </div>
          <p className={styles.footerText}> Made by Shisuke Urahara</p>
        </div>
        <div class="flex flex-1">
          <img
            src={heroImg}
            alt="hero-img"
            className="w-full xl:h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default PageHOC;

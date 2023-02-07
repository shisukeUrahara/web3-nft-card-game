import React, { useState, useeffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton";
import { useGlobalContext } from "../context";
import styles from "../styles";
import { alertIcon, gameRules } from "../assets";

const GameInfo = () => {
  const { contract, gameData, setShowAlert } = useGlobalContext();
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const navigate = useNavigate();

  const handleBattleExit = async () => {
    console.log("**@ handleBattleExit called , ");
    const battleName = gameData.activeBattle.name;

    try {
      await contract.quitBattle(battleName, {
        gasLimit: 200000,
      });

      setShowAlert({
        status: true,
        type: "info",
        message: `You're quitting the ${battleName}`,
      });
    } catch (error) {
      setErrorMessage(error);
    }
  };
  return (
    <>
      <div className={styles.gameInfoIconBox}>
        <div
          className={`${styles.gameInfoIcon} ${styles.flexCenter}`}
          onClick={() => setToggleSidebar(true)}
        >
          <img src={alertIcon} alt="info" className={styles.gameInfoIconImg} />
        </div>
      </div>

      <div
        className={`${styles.gameInfoSidebar} ${styles.glassEffect} ${
          styles.flexBetween
        } ${
          toggleSidebar ? "translate-x-0" : "translate-x-full"
        } backdrop-blur-3xl `}
      >
        <div className="flex flex-col">
          <div className={styles.gameInfoSidebarCloseBox}>
            <div
              className={`${styles.flexCenter} ${styles.gameInfoSidebarClose}`}
              onClick={() => setToggleSidebar(false)}
            >
              X
            </div>
          </div>
          <h3 className={styles.gameInfoHeading}>Game Rules:</h3>
          <div className="mt-3">
            {gameRules?.map((rule, index) => (
              <p className={styles.gameInfoText} key={`game-rule-${index}`}>
                <span className="font-bold">{index + 1}</span>. {rule}
              </p>
            ))}
          </div>
        </div>

        <div className={`${styles.flexBetween} mt-10 gap-4 w-full`}>
          <CustomButton
            title="Change BattleGround"
            onClickHandler={() => navigate("/battleground")}
          />

          <CustomButton
            title="Exit Battle"
            onClickHandler={() => handleBattleExit()}
          />
        </div>
      </div>
    </>
  );
};

export default GameInfo;

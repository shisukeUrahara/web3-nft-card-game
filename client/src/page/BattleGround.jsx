import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles";
import { Alert } from "../components";
import { battlegrounds } from "../assets";
import { useGlobalContext } from "../context";

const BattleGround = () => {
  const { setShowAlert, showAlert, setBattleGround } = useGlobalContext();
  const navigate = useNavigate();

  const handleBattleGroundChoice = async (ground) => {
    console.log("**@ handleBattleGroundChoice called with ground , ", ground);

    setBattleGround(ground.id);
    localStorage.setItem("battleGround", ground.id);
    setShowAlert({
      status: true,
      type: "info",
      message: `${ground.name} is battle ready!`,
    });

    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };

  return (
    <div className={`${styles.flexCenter} ${styles.battlegroundContainer}`}>
      {showAlert?.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}

      <h1 className={`${styles.headText} text-center`}>
        Choose your
        <span className="text-siteViolet"> Battle </span>
        Ground
      </h1>

      <div className={`${styles.flexCenter} ${styles.battleGroundsWrapper}`}>
        {battlegrounds.map((ground, index) => (
          <div
            className={`${styles.flexCenter} ${styles.battleGroundCard}`}
            key={ground.id}
            onClick={() => handleBattleGroundChoice(ground)}
          >
            <img
              src={ground.image}
              alt="ground"
              className={`${styles.battleGroundCardImg}`}
            />

            <div className="info absolute">
              <p className={`${styles.battleGroundCardText}`}>{ground.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BattleGround;

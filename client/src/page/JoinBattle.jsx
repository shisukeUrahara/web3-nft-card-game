import React, { useEffect } from "react";
import styles from "../styles";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";
import { CustomButton, PageHOC } from "../components";

const JoinBattle = () => {
  const { contract, walletAddress, gameData, setShowAlert, setBattleName } =
    useGlobalContext();
  const navigate = useNavigate();

  const handleJoinBattle = async (battleName) => {
    console.log("**@ handleJoinBattle called with battleName , ", battleName);
    setBattleName(battleName);
    try {
      await contract.joinBattle(battleName);

      setShowAlert({
        status: true,
        type: "success",
        message: `Joining ${battleName}`,
      });
    } catch (err) {
      console.log("**@ join battle error caught , error is , ", err);
    }
  };

  return (
    <>
      <h2 className={styles.joinHeadText}> Available Battles:</h2>

      <div className={styles.joinContainer}>
        {gameData?.pendingBattles.length ? (
          gameData.pendingBattles
            .filter((battle) => !battle.players.includes(walletAddress))
            .map((battle, index) => (
              <div key={battle.name + index} className={styles.flexBetween}>
                <p className={styles.joinBattleTitle}>
                  {index + 1}. {battle.name}
                </p>
                <CustomButton
                  title="Join"
                  onClickHandler={() => handleJoinBattle(battle.name)}
                />
              </div>
            ))
        ) : (
          <p className={styles.joinLoading}>Reload page to see new battles</p>
        )}
      </div>
      <p className={styles.infoText} onClick={() => navigate("/create-battle")}>
        Or create a new battle
      </p>
    </>
  );
};

export default PageHOC(
  JoinBattle,
  <>
    Join <br /> a Battle
  </>,
  <>Join already existing battles</>
);

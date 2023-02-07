import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHOC, CustomButton, CustomInput, GameLoad } from "../components";
import styles from "../styles";
import { useGlobalContext } from "../context";

const CreateBattle = () => {
  const navigate = useNavigate();
  const { contract, battleName, setBattleName, gameData, setErrorMessage } =
    useGlobalContext();
  const [waitBattle, setWaitBattle] = useState(false);

  const handleClick = async () => {
    if (!battleName || !battleName.trim()) {
      return null;
    }
    try {
      await contract.createBattle(battleName, {
        gasLimit: 200000,
      });
      setWaitBattle(true);
    } catch (err) {
      setErrorMessage(err);
    }
  };

  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 1) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    } else if (gameData?.activeBattle?.battleStatus === 0) {
      setWaitBattle(true);
    }
  }, [gameData]);

  return (
    <>
      {waitBattle && <GameLoad />}
      <div className="flex flex-col mb-5">
        <CustomInput
          label="Battle"
          placeholder="Enter battle name"
          value={battleName}
          onChangeHandler={setBattleName}
        />
        <CustomButton
          title="Create Battle"
          onClickHandler={handleClick}
          restStyles="mt-6"
        />
      </div>
      <p className={styles.infoText} onClick={() => navigate("/join-battle")}>
        or Join Existing battles
      </p>
    </>
  );
};

export default PageHOC(
  CreateBattle,
  <>
    Create <br /> a new battle
  </>,
  <>Create your own battle and wait for other players to join you.</>
);

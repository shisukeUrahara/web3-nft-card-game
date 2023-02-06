import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";
import { Alert, ActionButton, Card, GameInfo, PlayerInfo } from "../components";
import styles from "../styles";
import {
  attack,
  attackSound,
  defense,
  defenseSound,
  player01 as player01Icon,
  player02 as player02Icon,
} from "../assets";
import { playAudio } from "../utils/animation";
const Battle = () => {
  const {
    contract,
    walletAddress,
    gameData,
    showAlert,
    setShowAlert,
    battleGround,
    setErrorMessage,
  } = useGlobalContext();
  const [player1, setPlayer1] = useState({});
  const [player2, setPlayer2] = useState({});
  const { battleName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayerInfo = async () => {
      try {
        let player01Address = null;
        let player02Address = null;

        if (
          gameData.activeBattle.players[0].toLowerCase() ===
          walletAddress.toLowerCase()
        ) {
          player01Address = gameData.activeBattle.players[0];
          player02Address = gameData.activeBattle.players[1];
        } else {
          player01Address = gameData.activeBattle.players[1];
          player02Address = gameData.activeBattle.players[0];
        }

        console.log("**@ in Battle , calculating stats ");
        console.log("**@ player01Address is , ", player01Address);
        console.log("**@ player02Address is , ", player02Address);

        const p1TokenData = await contract.getPlayerToken(player01Address);
        const player01 = await contract.getPlayer(player01Address);
        const player02 = await contract.getPlayer(player02Address);

        console.log("**@ p1TokenData is , ", p1TokenData);
        console.log("**@ player01 is , ", player01);
        console.log("**@ player02 is , ", player02);

        const p1Attack = p1TokenData.attackStrength.toNumber();
        const p1Defense = p1TokenData.defenseStrength.toNumber();
        const p1Health = player01.playerHealth.toNumber();
        const p1Mana = player01.playerMana.toNumber();
        const p2Health = player02.playerHealth.toNumber();
        const p2Mana = player02.playerMana.toNumber();

        console.log("**@ p1Attack is , ", p1Attack);
        console.log("**@ p1Defense is , ", p1Defense);
        console.log("**@ p1Health is , ", p1Health);
        console.log("**@ p1Mana is , ", p1Mana);
        console.log("**@ p2Health is , ", p2Health);
        console.log("**@ p2Mana is , ", p2Mana);

        setPlayer1({
          ...player01,
          att: p1Attack,
          def: p1Defense,
          health: p1Health,
          mana: p1Mana,
        });
        setPlayer2({
          ...player02,
          att: "X",
          def: "X",
          health: p2Health,
          mana: p2Mana,
        });
      } catch (err) {
        setErrorMessage(err);
      }
    };

    if (contract && gameData?.activeBattle) {
      fetchPlayerInfo();
    }
  }, [contract, gameData, battleName]);

  const makeAMove = async (choice) => {
    playAudio(choice === 1 ? attackSound : defenseSound);
    try {
      await contract.attackOrDefendChoice(choice, battleName);

      setShowAlert({
        status: true,
        type: "info",
        message: `Initiating ${choice === 1 ? "attack" : "defense"}`,
      });
    } catch (err) {
      console.log("**@ make move error caught , error is , ", err);
      setErrorMessage(err);
    }
  };

  return (
    <div
      className={`${styles.flexBetween} ${styles.gameContainer} ${battleGround}`}
    >
      {showAlert?.status && (
        <Alert type={showAlert.type} message={showAlert.message} />
      )}
      <PlayerInfo player={player2} playerIcon={player02Icon} mt />

      <div className={`${styles.flexCenter} flex-col my-10`}>
        <Card card={player2} title={player2?.playerName} cardRef="" playerTwo />

        <div className="flex items-center flex-row">
          <ActionButton
            imgUrl={attack}
            restStyles="mr-2 hover:border-yellow-400"
            handleClick={() => makeAMove(1)}
          />

          <Card
            card={player1}
            title={player1?.playerName}
            cardRef=""
            restStyles="mt-6"
          />

          <ActionButton
            imgUrl={defense}
            restStyles="ml-2 hover:border-red-600"
            handleClick={() => makeAMove(2)}
          />
        </div>
      </div>

      <PlayerInfo player={player1} playerIcon={player01Icon} />

      <GameInfo />
    </div>
  );
};

export default Battle;

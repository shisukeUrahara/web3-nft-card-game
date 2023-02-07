import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHOC, CustomInput, CustomButton } from "../components";
import { useGlobalContext } from "../context";

const Home = () => {
  const { contract, walletAddress, setShowAlert, setErrorMessage, gameData } =
    useGlobalContext();
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const playerExists = await contract.isPlayer(walletAddress);

      if (!playerExists) {
        await contract.registerPlayer(playerName, playerName, {
          gasLimit: 200000,
        });

        setShowAlert({
          status: true,
          type: "info",
          message: `${playerName} is being summoned`,
        });
      } else {
        setShowAlert({
          status: true,
          type: "failure",
          message: `Player already exists for ${walletAddress}`,
        });
      }
    } catch (err) {
      setErrorMessage(err);
    }
  };

  useEffect(() => {
    const checkForPlayerToken = async () => {
      try {
        const playerExists = await contract.isPlayer(walletAddress);
        const playerTokenExists = await contract.isPlayerToken(walletAddress);

        if (playerExists && playerTokenExists) {
          navigate("/create-battle");
        }
      } catch (err) {
        setErrorMessage(err);
      }
    };

    if (contract) {
      checkForPlayerToken();
    }
  }, [contract]);

  useEffect(() => {
    if (gameData?.activeBattle) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    }
  }, [gameData]);

  return (
    <div className="flex flex-col">
      <CustomInput
        label="Name"
        value={playerName}
        placeholder="Enter your name here"
        onChangeHandler={setPlayerName}
      />

      <CustomButton
        title="Register"
        onClickHandler={() => {
          handleClick();
        }}
        restStyles="mt-6"
      />
    </div>
  );
};

export default PageHOC(
  Home,
  <>
    Welcome to Avax Gods <br /> a Web3 NFT Card Game
  </>,
  <>
    Connect your wallet to start playing <br /> the ultimate Web3 Battle Card
    Game
  </>
);

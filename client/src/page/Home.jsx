import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHOC, CustomInput, CustomButton } from "../components";
import { useGlobalContext } from "../context";

const Home = () => {
  const { contract, walletAddress, setShowAlert, setErrorMessage } =
    useGlobalContext();
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const handleClick = async () => {
    console.log("**@ handleClick called , contract is , ", contract);
    console.log("**@ handleClick called, walletAddress is , ", walletAddress);

    try {
      const playerExists = await contract.isPlayer(walletAddress);
      console.log("**@ playerExists is , ", playerExists);

      if (!playerExists) {
        await contract.registerPlayer(playerName, playerName);

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
      console.log("**@ register error caught , error is , ", err);
      setErrorMessage(err);
      // setShowAlert({
      //   status: true,
      //   type: "failure",
      //   message: "Something went wrong",
      // });
    }
  };

  useEffect(() => {
    const checkForPlayerToken = async () => {
      try {
        const playerExists = await contract.isPlayer(walletAddress);
        const playerTokenExists = await contract.isPlayerToken(walletAddress);

        console.log("**@ playerExists 2 is , ", playerExists);
        console.log("**@ playerTokenExists 2 is , ", playerTokenExists);
        if (playerExists && playerTokenExists) {
          navigate("/create-battle");
        }
      } catch (err) {
        console.log(
          "**@ contract useEffect error caught , error is , ",
          err?.message
        );
        setErrorMessage(err);

        // setShowAlert({
        //   status: true,
        //   type: "failure",
        //   message: "Something went wrong",
        // });
      }
    };

    if (contract) {
      checkForPlayerToken();
    }
  }, [contract]);

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

import React, { useState } from "react";
import { PageHOC, CustomInput, CustomButton } from "../components";
import { useGlobalContext } from "../context";

const Home = () => {
  const { contract, walletAddress, setShowAlert } = useGlobalContext();
  const [playerName, setPlayerName] = useState("");

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
    } catch (error) {
      // alert(error);
      console.log("**@ register error caught , error is , ", error?.message);
      setShowAlert({
        status: true,
        type: "failure",
        message: "Something went wrong",
      });
    }
  };

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

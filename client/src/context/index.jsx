import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
} from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useNavigate } from "react-router-dom";
import { useAccount, useProvider, useSigner } from "wagmi";
import { ABI, ADDRESS } from "../contracts";
import { createEventListener } from "./createEventListeners";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  //  interact with the smart contract
  const navigate = useNavigate();
  const { address: connectedAddress } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [walletAddress, setWalletAddress] = useState("");
  const [battleName, setBattleName] = useState("");
  const [appProvider, setAppProvider] = useState("");
  const [contract, setContract] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState({
    status: false,
    type: "info",
    message: "",
  });
  const [gameData, setGameData] = useState({
    players: [],
    pendingBattles: [],
    activeBattle: null,
  });
  const [updateGameData, setUpdateGameData] = useState(0);
  const [battleGround, setBattleGround] = useState("bg-astral");
  const player1Ref = useRef();
  const player2Ref = useRef();

  useEffect(() => {
    const battleGroundFromStorage = localStorage.getItem("battleGround");

    if (battleGroundFromStorage) {
      setBattleGround(battleGroundFromStorage);
    } else {
      localStorage.setItem("battleGround", battleGround);
      // setBattleGround(battleGround);
    }
  }, []);

  useEffect(() => {
    setWalletAddress(connectedAddress);
  }, [connectedAddress]);

  useEffect(() => {
    if (signer && provider) {
      const newContract = new ethers.Contract(ADDRESS, ABI, signer);
      setAppProvider(provider);
      setContract(newContract);
    }
  }, [signer, provider]);

  useEffect(() => {
    if (contract) {
      createEventListener({
        provider,
        navigate,
        walletAddress,
        contract,
        setShowAlert,
        setUpdateGameData,
        player1Ref,
        player2Ref,
      });
    }
  }, [contract]);

  useEffect(() => {
    if (showAlert?.status) {
      const timer = setTimeout(() => {
        setShowAlert({ status: false, type: "info", message: "" });
      }, [5000]);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  //  set game data to the state
  useEffect(() => {
    const fetchGameData = async () => {
      const battles = await contract.getAllBattles();
      const pendingBattles = battles.filter(
        (battle) => battle.battleStatus === 0
      );

      //  find battle taht current player has created
      let activeBattle = null;
      battles.forEach((battle) => {
        //  check if current player is part of the battle

        let battleWithCurrentPlayer = battle.players.find(
          (player) => player.toLowerCase() === walletAddress.toLowerCase()
        );

        if (battleWithCurrentPlayer) {
          //  check if current battle doesnot have a winner yet , i.e current battle is still active
          if (battle.winner.startsWith("0x00")) {
            activeBattle = battle;
          }
        }
      });

      setGameData({ pendingBattles: pendingBattles.slice(1), activeBattle });
    };

    if (contract) {
      fetchGameData();
    }
  }, [contract, updateGameData]);

  // useEffect to handle showing error messages
  useEffect(() => {
    if (errorMessage) {
      const parsedErrorMessage = errorMessage?.reason
        ?.slice("execution reverted: ".length)
        .slice(0, -1);

      if (parsedErrorMessage) {
        setShowAlert({
          status: true,
          type: "failure",
          message: parsedErrorMessage,
        });
      }
    }
  }, [errorMessage]);

  return (
    <GlobalContext.Provider
      value={{
        contract,
        walletAddress,
        showAlert,
        setShowAlert,
        battleName,
        setBattleName,
        gameData,
        setGameData,
        updateGameData,
        setUpdateGameData,
        battleGround,
        setBattleGround,
        errorMessage,
        setErrorMessage,
        player1Ref,
        player2Ref,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);

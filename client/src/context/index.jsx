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
import { ABI, ADDRESS } from "../contracts";
import { createEventListener } from "./createEventListeners";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  //  interact with the smart contract
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState("");
  const [contract, setContract] = useState("");
  const [showAlert, setShowAlert] = useState({
    status: false,
    type: "info",
    message: "",
  });

  const updateWalletAddress = async () => {
    await window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts) => {
        console.log("**@ accounts are , ", accounts);
        if (accounts) {
          setWalletAddress(accounts[0]);
        }
      })
      .catch((err) => {
        console.log("**@ wallet connection error , err is , ", err);
      });
  };

  useEffect(() => {
    updateWalletAddress();

    window.ethereum.on("accountsChanged", updateWalletAddress);
  }, []);

  useEffect(() => {
    const setSmartContractAndProvider = async () => {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const newProvider = new ethers.providers.Web3Provider(connection);
      const signer = newProvider.getSigner();
      const newContract = new ethers.Contract(ADDRESS, ABI, signer);

      setProvider(provider);
      setContract(newContract);
    };

    setSmartContractAndProvider();
  }, []);

  useEffect(() => {
    if (contract) {
      createEventListener({
        provider,
        navigate,
        walletAddress,
        contract,
        setShowAlert,
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

  return (
    <GlobalContext.Provider
      value={{
        contract,
        walletAddress,
        showAlert,
        setShowAlert,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);

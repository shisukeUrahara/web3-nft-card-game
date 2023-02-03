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

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  //  interact with the smart contract
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState("");
  const [contract, setContract] = useState("");

  const updateWalletAddress = async () => {
    const accounts = window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log("**@ accounts are , ", accounts);

    if (accounts) {
      setWalletAddress(accounts[0]);
    }
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
      const signer = newProvider.signer();
      const newContract = new ethers.Contract(ADDRESS, ABI, signer);

      setProvider(provider);
      setContract(newContract);
    };

    setSmartContractAndProvider();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        contract,
        walletAddress,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);

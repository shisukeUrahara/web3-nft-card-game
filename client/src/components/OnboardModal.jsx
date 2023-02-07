import { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  useNetwork,
  useSwitchNetwork,
  useBalance,
  useAccount,
  useConnect,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import styles from "../styles";
import CustomButton from "./CustomButton";
import { useGlobalContext } from "../context";
// import { GetParams, SwitchNetwork } from "../utils/onboard.js";

const OnboardModal = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { updateCurrentWalletAddress, walletAddress } = useGlobalContext();
  const [step, setStep] = useState(-1);
  const { chain: selectedChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { address: connectedAddress } = useAccount();

  const { data: userBalance, isError: isBalanceError } = useBalance({
    address: connectedAddress,
  });
  const { connect } = useConnect();

  function isEthereum() {
    if (window.ethereum) return true;

    return false;
  }

  const GetParams = async () => {
    const response = {
      isError: false,
      message: "",
      step: -1,
      balance: 0,
      account: "0x0",
    };

    if (!isEthereum()) {
      response.step = 0;

      return response;
    }

    if (!connectedAddress) {
      response.step = 1;

      return response;
    }

    response.account = walletAddress;

    if (selectedChain?.id !== 5) {
      response.step = 2;

      return response;
    }

    if (isBalanceError) {
      response.isError = true;
      response.message = "Error fetching balance!";

      return response;
    }

    response.balance = userBalance?.formatted;

    if (userBalance?.formatted < 0.2) {
      response.step = 3;

      return response;
    }

    return response;
  };
  async function resetParams() {
    const currentStep = await GetParams();
    setStep(currentStep.step);
    setIsOpen(currentStep.step !== -1);
  }

  useEffect(() => {
    resetParams();
  }, [connectedAddress, selectedChain]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSwitchNetwork = async () => {
    await switchNetwork?.(5);
  };

  const generateStep = (st) => {
    switch (st) {
      case 0:
        return (
          <>
            <p className={styles.modalText}>You don't have Wallet installed!</p>
            <CustomButton
              title="Download Metamask"
              onClickHandler={() =>
                window.open("https://metamask.io/", "_blank")
              }
            />
          </>
        );

      case 1:
        return (
          <>
            <p className={styles.modalText}>
              You haven't connected your account to Wallet!
            </p>
            <div className={`${styles.btn}`}>
              <ConnectButton
                accountStatus="address"
                showBalance={false}
                label="Connect wallet"
              />
            </div>
          </>
        );

      case 2:
        return (
          <>
            <p className={styles.modalText}>
              You're on a different network. Switch to Goerli testnet.
            </p>
            <CustomButton
              title="Switch"
              onClickHandler={() => handleSwitchNetwork()}
            />
          </>
        );

      case 3:
        return (
          <>
            <p className={styles.modalText}>
              Oops, you don't have Goerli ETH in your account
            </p>
            <CustomButton
              title="Grab some test tokens"
              onClickHandler={() =>
                window.open("https://goerlifaucet.com/", "_blank")
              }
            />
          </>
        );

      default:
        return <p className={styles.modalText}>Good to go!</p>;
    }
  };

  return (
    <>
      {isMounted && (
        <Modal
          isOpen={modalIsOpen}
          className={`absolute inset-0 ${styles.flexCenter} flex-col ${styles.glassEffect}`}
          overlayClassName="Overlay"
        >
          {generateStep(step)}
        </Modal>
      )}
    </>
  );
};

export default OnboardModal;

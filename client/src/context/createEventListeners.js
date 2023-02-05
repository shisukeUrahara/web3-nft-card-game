import { ethers } from "ethers";
import { ABI } from "../contracts";

const AddNewEvent = async (eventFilter, provider, cb) => {
  // remove existing filters
  await provider.removeListener(eventFilter);

  provider.on(eventFilter, (logs) => {
    const parsedLog = new ethers.utils.Interface(ABI).parseLog(logs);
    cb(parsedLog);
  });
};

export const createEventListener = ({
  navigate,
  contract,
  provider,
  walletAddress,
  setShowAlert,
  setUpdateGameData,
}) => {
  const NewPlayerEventFilter = contract.filters.NewPlayer();
  AddNewEvent(NewPlayerEventFilter, provider, ({ args }) => {
    console.log("**@ New Player created , args are , ", args);

    if (walletAddress == args.owner) {
      setShowAlert({
        status: true,
        type: "success",
        message: "Player has been successfully registered",
      });
    }
  });

  //  adding a filter to join battle
  const NewBattleEventFilter = contract.filters.NewBattle();
  AddNewEvent(NewBattleEventFilter, provider, ({ args }) => {
    console.log("**@ New battle joined , args are , ", args);
    console.log("**@ New battle joined , walletAddress is , ", walletAddress);

    if (
      args.player1.toLowerCase() === walletAddress.toLowerCase() ||
      args.player2.toLowerCase() === walletAddress.toLowerCase()
    ) {
      navigate(`/battle/${args.battleName}`);
    }

    setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });
};

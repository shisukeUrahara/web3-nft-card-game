import { ethers } from "ethers";
import { ABI } from "../contracts";
import { playAudio, sparcle } from "../utils/animation";
import { defenseSound } from "../assets";
const zeroAccount = "0x0000000000000000000000000000000000000000";

const AddNewEvent = async (eventFilter, provider, cb) => {
  // remove existing filters
  await provider.removeListener(eventFilter);

  provider.on(eventFilter, (logs) => {
    const parsedLog = new ethers.utils.Interface(ABI).parseLog(logs);
    cb(parsedLog);
  });
};

const getCoordinates = (cardRef) => {
  const { left, top, width, height } = cardRef.current.getBoundingClientRect();
  return {
    pageX: left + width / 2,
    pageY: top + height / 2.25,
  };
};

export const createEventListener = ({
  navigate,
  contract,
  provider,
  walletAddress,
  setShowAlert,
  setUpdateGameData,
  player1Ref,
  player2Ref,
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

  const NewGameTokenEventFilter = contract.filters.NewGameToken();
  AddNewEvent(NewGameTokenEventFilter, provider, ({ args }) => {
    console.log("**@ New game token created!", args.owner);

    if (walletAddress.toLowerCase() === args.owner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: "success",
        message: "Player game token has been successfully generated",
      });

      navigate("/create-battle");
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

  //  adding a filter for making a move
  const BattleMoveEventFilter = contract.filters.BattleMove();
  AddNewEvent(BattleMoveEventFilter, provider, ({ args }) => {
    console.log("**@ New battle move made  , args are , ", args);
  });

  //  adding a filter to resolve battle moves and show exploding animation for players who were damaged
  const RoundEndedEventFilter = contract.filters.RoundEnded();
  AddNewEvent(RoundEndedEventFilter, provider, ({ args }) => {
    console.log("**@ round ended   , args are , ", args);
    console.log("**@ round ended   , walletAddress is , ", walletAddress);

    for (let i = 0; i < args.damagedPlayers.length; i++) {
      if (args.damagedPlayers[i] !== zeroAccount) {
        if (args.damagedPlayers[i] === walletAddress) {
          sparcle(getCoordinates(player1Ref));
        } else if (args.damagedPlayers[i] !== walletAddress) {
          sparcle(getCoordinates(player2Ref));
        }
      } else {
        playAudio(defenseSound);
      }
    }

    setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });

  //  adding a filter for battle ended event
  const BattleEndedEventFilter = contract.filters.BattleEnded();
  AddNewEvent(BattleEndedEventFilter, provider, ({ args }) => {
    console.log("**@ battle ended   , args are , ", args);
    console.log("**@ battle ended   , walletAddress is , ", walletAddress);

    if (walletAddress.toLowerCase() === args.winner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: "info",
        message: "You Won!",
      });
    } else if (walletAddress.toLowerCase() === args.loser.toLowerCase()) {
      setShowAlert({
        status: true,
        type: "failure",
        message: "You Lost!",
      });
    }

    navigate("/create-battle");
  });
};

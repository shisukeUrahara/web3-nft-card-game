import {
  argentWallet,
  braveWallet,
  coinbaseWallet,
  imTokenWallet,
  ledgerWallet,
  metaMaskWallet,
  omniWallet,
  trustWallet,
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

export const getRecommendedWallets = (chains) => {
  return [
    injectedWallet({ chains }),
    rainbowWallet({ chains }),
    walletConnectWallet({ chains }),
  ];
};

export const getOtherWallets = (chains) => {
  return [
    argentWallet({ chains }),
    braveWallet({ chains }),
    coinbaseWallet({ chains, appName: "User Wallet" }),
    imTokenWallet({ chains }),
    ledgerWallet({ chains }),
    metaMaskWallet({ chains }),
    omniWallet({ chains }),
    trustWallet({ chains }),
  ];
};

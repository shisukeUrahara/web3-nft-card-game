import "@rainbow-me/rainbowkit/styles.css";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

import { configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { allChains, appChains } from "../utils/Chains/index";
import { getRecommendedWallets, getOtherWallets } from "../utils/wallets/index";
let supportedChains;

const walletConfig = {
  walletEnv: process.env.NEXT_PUBLIC_APP_ENVIRONMENT || "testnet",
};

if (
  walletConfig.walletEnv &&
  walletConfig.walletEnv.toLowerCase() == "mainnet"
) {
  supportedChains = appChains.mainnetChains;
} else {
  supportedChains = appChains.testnetChains;
}

const { chains, provider } = configureChains(supportedChains, [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHECMY_RPC_URL || "" }),
  publicProvider(),
]);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: getRecommendedWallets(chains),
  },
  {
    groupName: "Others",
    wallets: getOtherWallets(chains),
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const appInfo = {
  appName: "Web3 nft card game",
};

export const Config = {
  client: wagmiClient,
  appInfo: appInfo,
  supportedChains: chains,
};

import "@rainbow-me/rainbowkit/styles.css";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";

import { configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { infuraProvider } from "wagmi/providers/infura";

import { allChains, appChains } from "../utils/Chains/index";
import { getRecommendedWallets, getOtherWallets } from "../utils/wallets/index";
const env = import.meta.env;

let supportedChains;

const walletConfig = {
  walletEnv: env.VITE_ENVIRONMENT || "testnet",
};

console.log("**@ WALLETCONFIG , ENV IS , ", env);
console.log("**@ WALLETCONFIG , PROCESS ENV  IS , ", env.VITE_ENVIRONMENT);
console.log(
  "**@ WALLETCONFIG , PROCESS ALCHECMY URL IS , ",
  env.VITE_ALCHEMY_RPC_URL
);

if (
  walletConfig.walletEnv &&
  walletConfig.walletEnv.toLowerCase() == "mainnet"
) {
  supportedChains = appChains.mainnetChains;
} else {
  supportedChains = appChains.testnetChains;
}

const { chains, provider } = configureChains(supportedChains, [
  alchemyProvider({ apiKey: env.VITE_ALCHEMY_RPC_URL }),
  infuraProvider({ apiKey: env.VITE_INFURA_RPC_URL }),
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
  autoConnect: false,
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

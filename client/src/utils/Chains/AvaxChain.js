// import { Chain } from "@rainbow-me/rainbowkit";

export const AvaxChain = {
  id: 43114,
  name: "Avalanche Mainnet",
  network: "avalanche",
  iconUrl: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Avalanche",
    symbol: "AVAX",
  },
  rpcUrls: {
    default: "https://avalanche-mainnet.infura.io/v3/",
  },
  blockExplorers: {
    default: { name: "SnowTrace", url: "https://snowtrace.io/" },
    etherscan: { name: "SnowTrace", url: "https://snowtrace.io/" },
  },
  testnet: false,
};

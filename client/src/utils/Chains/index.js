import { chain } from "wagmi";

export const allChains = [chain.goerli, chain.mainnet];
export const testnetChains = [chain.goerli];
export const mainnetChains = [chain.mainnet];

export const appChains = {
  allChains,
  testnetChains,
  mainnetChains,
};

import { AvaxChain } from "./AvaxChain";
import { FujiChain } from "./FujiChain";

export const allChains = [AvaxChain, FujiChain];
export const testnetChains = [FujiChain];
export const mainnetChains = [AvaxChain];

export const appChains = {
  allChains,
  testnetChains,
  mainnetChains,
};

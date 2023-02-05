import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { Config } from "./config/WalletConfig";

ReactDOM.createRoot(document.getElementById("root")).render(
  <WagmiConfig client={Config.client}>
    <RainbowKitProvider
      appInfo={Config.appInfo}
      chains={Config.supportedChains}
      modalSize="compact"
    >
      <App />
    </RainbowKitProvider>
  </WagmiConfig>
);

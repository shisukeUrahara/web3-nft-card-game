import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home, CreateBattle, JoinBattle, BattleGround } from "./page";
import { GlobalContextProvider } from "./context";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <GlobalContextProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-battle" element={<CreateBattle />} />
            <Route path="/join-battle" element={<JoinBattle />} />
            <Route path="/battleground" element={<BattleGround />} />
          </Routes>
        </GlobalContextProvider>
      </BrowserRouter>
    </>
  );
};

export default App;

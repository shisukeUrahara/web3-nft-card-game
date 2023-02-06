import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home, CreateBattle, JoinBattle, BattleGround, Battle } from "./page";
import { GlobalContextProvider } from "./context";
import OnBoardModal from "./components/OnboardModal";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <GlobalContextProvider>
          <OnBoardModal />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-battle" element={<CreateBattle />} />
            <Route path="/join-battle" element={<JoinBattle />} />
            <Route path="/battleground" element={<BattleGround />} />
            <Route path="/battle/:battleName" element={<Battle />} />
          </Routes>
        </GlobalContextProvider>
      </BrowserRouter>
    </>
  );
};

export default App;

import "./App.css";
import { Button } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import MessagePage from "./Pages/MessagePage";

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} exact />

          <Route path="/chats" element={<MessagePage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

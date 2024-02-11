import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./Context/ChatProvider";
import { SocketContextProvider } from "./Context/SocketContext";

const AppWrapper = () => {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <ChatProvider>
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </ChatProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppWrapper />);

import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";


const ChatBox = ({refetch, setRefetch}) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      className="flex-col items-center p-3 bg-white rounded-lg border ml-2 border-black
      shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20
      "
      width={{ base: "100%", md: "68%" }}
    >
      <SingleChat refetch={refetch} setRefetch={setRefetch} />
    </Box>
  );
};

export default ChatBox;

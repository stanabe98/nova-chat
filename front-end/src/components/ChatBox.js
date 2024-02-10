import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";


const ChatBox = ({refetch, setRefetch}) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      className="flex-col items-center p-3 bg-white rounded-lg border ml-2"
      width={{ base: "100%", md: "68%" }}
    >
      Chat Box
      <SingleChat refetch={refetch} setRefetch={setRefetch}/>
    </Box>
  );
};

export default ChatBox;

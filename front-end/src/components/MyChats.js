import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { useSocketContext } from "../Context/SocketContext";
import {
  useToast,
  Box,
  Button,
  Stack,
  Text,
  Avatar,
  AvatarBadge,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender, getSenderId } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import axios from "axios";

const MyChats = ({ refetch }) => {
  const [loggedUser, setLoggedUser] = useState();
  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    getConfig,
    refetchChats,
    setRefetchChats,
  } = ChatState();
  const { onlineUsers } = useSocketContext();
  const [latestMessage, setLatestMessage] = useState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const { data } = await axios.get("/api/chat", getConfig(user));
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load chats data",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [refetch, refetchChats]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      width={{ base: "100%", md: "33%" }}
      className="flex flex-col items-center p-3 bg-white rounded-lg border"
    >
      <Box
        className="flex w-full justify-between items-center pb-3 px-3"
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily={"Work sans"}
      >
        My Chats
        <GroupChatModal>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            Create new group chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        background={"#F8F8F8"}
        className="flex flex-col p-3 w-full h-full overflow-y-hidden rounded-lg"
      >
        {chats ? (
          <Stack
            className="overflow-y-scroll"
            style={{ scrollbarWidth: "none" }}
          >
            {chats.map((chat) => (
              <>
                <Box
                  onClick={() => {
                    setSelectedChat(chat);
          
                  }}
                  className="cursor-pointer px-3 py-3 rounded-lg"
                  background={
                    selectedChat && selectedChat._id === chat._id
                      ? "#38B2AC"
                      : "#E8E8E8"
                  }
                  color={
                    selectedChat && selectedChat._id === chat._id
                      ? "white"
                      : "black"
                  }
                  key={chat._id}
                >
                  <div className="flex items-center">
                    <Avatar size={"sm"} className="mr-1">
                      {onlineUsers.includes(
                        getSenderId(chat.isGroupChat, loggedUser, chat.users)
                      ) ? (
                        <AvatarBadge boxSize="1.25em" bg="green.400" />
                      ) : null}
                    </Avatar>
                    <Text>
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text>
                  </div>
                  <span>{chat.latestMessage?.content}</span>
                </Box>
              </>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;

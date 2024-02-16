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
    userNotfications,
    setUserNotifications,
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

  const isMessageUnread = (chatId, chat) => {
    console.log("-------", chat.latestMessage?.sender?.name);
    return userNotfications.some((n) => n.chatId === chatId);
  };

  const getSenderName = (chat) => {
    if (!chat.latestMessage) {
      return "";
    }
    if (chat.latestMessage?.sender?.name !== user.name) {
      return chat.latestMessage?.sender?.name;
    } else {
      return "You";
    }
  };

  const getDisplayPic = (chat) => {
    if (!chat.isGroupChat) {
      return chat.users[1].pic;
    } else {
      return "";
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
      className="flex flex-col items-center p-3 bg-white rounded-lg border-black
      shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20
      "
    >
      <Box
        className="flex w-full justify-between items-center pb-3 px-3 text-gray-50
        "
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
        // background={"#F8F8F8"}
        className="flex flex-col p-3 w-full h-full overflow-y-hidden rounded-lg
        shadow-md bg-gray-700 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10
        
        "
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
                  <div className="flex items-center text-ellipsis ">
                    <Avatar
                      size={"md"}
                      className="mr-3"
                      src={getDisplayPic(chat)}
                    >
                      {onlineUsers.includes(
                        getSenderId(chat.isGroupChat, loggedUser, chat.users)
                      ) ? (
                        <AvatarBadge boxSize="1em" bg="green.400" />
                      ) : null}
                    </Avatar>
                    <div className="h-14 overflow-hidden ">
                      <Text
                        className={`text-lg ${
                          isMessageUnread(chat._id, chat)
                            ? "font-bold"
                            : "font-semibold"
                        }`}
                      >
                        {!chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName}
                      </Text>

                      <span
                        className={`text-base ${
                          isMessageUnread(chat._id, chat) ? "font-semibold" : ""
                        }  overflow-hidden whitespace-nowrap`}
                      >
                        {chat.latestMessage
                          ? `${getSenderName(chat)}:  ${
                              chat.latestMessage?.content
                            }`
                          : "draft"}
                      </span>
                    </div>
                  </div>
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

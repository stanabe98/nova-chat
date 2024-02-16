import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  Text,
  IconButton,
  Spinner,
  FormControl,
  Input,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderDetails } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typingAnime.json";
import { useSocketContext } from "../Context/SocketContext";
import { deleteUserNotifications } from "./helpers/methods";

const SingleChat = ({ refetch, setRefetch }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [typing, setTyping] = useState(false);
  const [isUserTyping, setisUserTyping] = useState(false);
  const [userTyping, setUserTyping] = useState();
  const [isTyping, setIsTyping] = useState(false);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const {
    user,
    selectedChat,
    setSelectedChat,
    getConfig,
    postConfig,
    refetchChats,
    setRefetchChats,
    refetchUserInfo,
    setRefetchUserInfo,
  } = ChatState();
  const toast = useToast();
  const { socket } = useSocketContext();

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        getConfig(user)
      );

      setMessages(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load messages",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      console.log("new message-----------", newMessage.chat._id);
      setRefetchChats(!refetchChats);

      if (selectedChat !== "" && selectedChat?._id === newMessage.chat._id) {
        deleteUserNotifications(user._id, newMessage.chat._id);
        setMessages([...messages, newMessage]);
        console.log("executing if");
      } else {
        console.log("executing else");
        setRefetchUserInfo(!refetchUserInfo);
      }
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [
    socket,
    setMessages,
    messages,
    refetchChats,
    selectedChat,
    setSelectedChat,
  ]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          postConfig(user)
        );

        setMessages([...messages, data]);
        setRefetchChats(!refetchChats);
      } catch (error) {
        toast({
          title: "Error Occured",
          description: "Failed to send the message",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!typing) {
      setTyping(true);
    }

    var timerLength = 1500;
    setTimeout(() => {
      if (typing) {
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            className="flex pb-3 px-2 items-center text-gray-100 font-semibold"
            width={"100%"}
            fontFamily={"Work sans"}
            justifyContent={{ base: "space-between" }}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              className="text-gray-200"
              icon={<ArrowBackIcon />}
              onClick={() => {
                setSelectedChat("");
              }}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderDetails(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  refetch={refetch}
                  setRefetch={setRefetch}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            className="flex flex-col justify-end p-3 rounded-lg overflow-y-hidden
             shadow-md bg-slate-800 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30
            "
            width={"100%"}
            height={"100%"}
          >
            {loading ? (
              <Spinner size={"xl"} className="w-20 h-20  self-center m-auto" />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired marginTop={3}>
              {isUserTyping ? (
                <div className="h-8">
                  <Lottie
                    options={defaultOptions}
                    className="ml-0"
                    width={60}
                    style={{ marginLeft: 0 }}
                  />
                </div>
              ) : (
                <div className="h-8"></div>
              )}
              <Input
                variant={"filled"}
                bg={"#E0E0E0"}
                placeholder="Message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box className="flex items-center justify-center pb-3 " height={"100%"}>
          <div className="bg-gray-800 rounded-lg px-1">
            <Text
              fontSize={"3xl"}
              paddingBottom={3}
              className="text-gray-100"
              fontFamily={"Work sans"}
            >
              {`Welcome ${user.name} 🫡`}
            </Text>
            <Text
              fontSize={"3xl"}
              paddingBottom={3}
              className="text-gray-100"
              fontFamily={"Work sans"}
            >
              {`Click on a chat to begin`}
            </Text>
          </div>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

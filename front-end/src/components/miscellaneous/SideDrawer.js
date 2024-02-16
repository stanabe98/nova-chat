import React, { useState, useEffect } from "react";
import {
  Box,
  useToast,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import MailIcon from "@mui/icons-material/Mail";
import logo from "../../images/logo2.png";
import { ChatState } from "../../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import { deleteUserNotifications } from "../helpers/methods";
import "../../components/styles.css"

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const {
    user,
    setSelectedChat,
    selectedChat,
    chats,
    setChats,
    getConfig,
    postConfig,
    refetchUserInfo,
    setRefetchUserInfo,
    userNotfications,
    setUserNotifications,
  } = ChatState();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const { data } = await axios.get(
          `/api/user/currentuser`,
          getConfig(user)
        );
        const uniqueChatIds = data.notifications.reduce((acc, curr) => {
          const existingIndex = acc.findIndex(
            (item) => item.chatId === curr.chatId
          );

          if (existingIndex === -1) {
            acc.push({ chatId: curr.chatId, sender: curr.sender });
          }
          return acc;
        }, []);

        setUserNotifications(uniqueChatIds);
        console.log("data is " + JSON.stringify(uniqueChatIds));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchdata();
  }, [refetchUserInfo]);

  useEffect(() => {
    const containsChatId = userNotfications.some(
      (n) => n.chatId === selectedChat._id
    );
    if (containsChatId) {
      console.log("yessss");
      deleteUserNotifications(user._id, selectedChat._id);
      setRefetchUserInfo(!refetchUserInfo);
    } else {
      console.log("noooo");
    }
  }, [selectedChat, setSelectedChat]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const selectChatByID = (chatId) => {
    const foundChat = chats.filter((s) => s._id === chatId);
    console.log("selectedChat", foundChat);
    setSelectedChat(foundChat[0]);
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Empty search",
        status: "warning",
        duration: 1000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);

      const { data } = await axios.get(
        `/api/user?search=${search}`,
        getConfig(user)
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the search results",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const { data } = await axios.post(
        "/api/chat",
        { userId },
        postConfig(user)
      );

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error retreiving chat data",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        className="flex justify-between items-center  w-full border-black
            shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 
        "
        padding="5px 10px 5px 10px"
        borderWidth="3px"
      >
        <Tooltip
          label="Search users to chat"
          hasArrow
          placeContent={"bottom-end"}
        >
          <Button variant={"ghost"} onClick={onOpen}>
            <i class="fa-solid fa-magnifying-glass"></i>
            <Text className="px-4" display={{ base: "none", md: "flex" }}>
              Search
            </Text>
          </Button>
        </Tooltip>
        <Text
          className="text-2xl flex items-center text-gray-100 font-semibold text-3xl"
          fontFamily="Work sans"
        >
          Nova-Chat
          <div >
            <img width="40rem" src={logo} alt="Logo" />
          </div>
        </Text>
        <div>
          <Menu>
            <MenuButton
              padding={1}
              paddingRight={2}
              style={{ position: "relative" }}
            >
              {userNotfications.length ? (
                <div
                  className="w-4 h-4 rounded-full bg-cyan-300 p-0 ml-4 -mb-4 font-bold "
                  style={{
                    position: "absolute",
                    fontSize: "10px",
                    animation: "bounceIn 0.5s ease",
                  }}
                >
                  {userNotfications.length}
                </div>
              ) : null}

              <MailIcon color="action" style={{ zIndex: "10" }} />
            </MenuButton>
            <MenuList paddingLeft={2}>
              {!userNotfications.length && "No new mesages"}
              {userNotfications.map((item) => (
                <MenuItem
                  key={item.chatId}
                  onClick={() => {
                    selectChatByID(item.chatId);
                    deleteUserNotifications(user._id, item.chatId);
                    setUserNotifications(
                      userNotfications.filter((n) => n.chatId != item.chatId)
                    );
                  }}
                >
                  {`New message from ${item.sender}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu className="z-100">
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                cursor={"pointer"}
                size={"sm"}
                name={user ? user.name : "Stanley"}
              />
            </MenuButton>
            <MenuList className="z-100">
              <ProfileModal user={user}>
                <MenuItem className="text-black">My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px"></DrawerHeader>
          <DrawerBody>
            <Box className="flex pb-2">
              <Input
                marginRight={2}
                placeholder="Search by name or email"
                value={search}
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                  if (!e.target.value.trim()) {
                    setSearchResult([]);
                  }
                  setSearch(e.target.value);
                }}
              />
              <Button onClick={handleSearch}>
                <i class="fa-solid fa-magnifying-glass"></i>
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner marginLeft="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;

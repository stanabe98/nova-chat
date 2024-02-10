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
import {
  BellIcon,
  AddIcon,
  WarningIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import MailIcon from "@mui/icons-material/Mail";
import Badge from "@mui/material/Badge";
import { ChatState } from "../../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat, getConfig, postConfig] = useState();
  const {
    user,
    setSelectedChat,
    selectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(()=>{
    console.log("selected chat changed")
  },[selectedChat])

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
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

      const { data } = await axios.get(`/api/user?search=${search}`, getConfig);

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

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const { data } = await axios.post("/api/chat", { userId }, postConfig);

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
        className="flex justify-between items-center bg-white w-full"
        padding="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip
          label="Search users to chat"
          hasArrow
          placeContent={"bottom-end"}
        >
          <Button variant={"ghost"} onClick={onOpen}>
            <i class="fa-solid fa-magnifying-glass"></i>
            <Text className="px-4" display={{ base: "none", md: "flex" }}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text className="text-2xl" fontFamily="Work sans">
          Nova-Chat
        </Text>
        <div>
          <Menu>
            <MenuButton
              padding={1}
              paddingRight={2}
              style={{ position: "relative" }}
            >
              {notification.length ? (
                <div
                  className="w-4 h-4 rounded-full bg-cyan-300 p-0 ml-4 -mb-4 font-bold "
                  style={{
                    position: "absolute",
                    fontSize: "10px",
                    animation: "bounceIn 0.5s ease",
                  }}
                >
                  {notification.length}
                </div>
              ) : null}

              <MailIcon color="action" style={{ zIndex: "10" }} />
            </MenuButton>
            <MenuList paddingLeft={2}>
              {!notification.length && "No new mesages"}
              {notification.map((item) => (
                <MenuItem
                  key={item._id}
                  onClick={() => {
                    // console.log(selectedChat ==)
                    setSelectedChat(item.chat);

                    console.log("selected chat drawer", selectedChat)
                    setNotification(notification.filter((n) => n !== item));
                  }}
                >
                  {item.chat.isGroupChat
                    ? `New message in ${item.chat.chatName}`
                    : `New message from ${getSender(user, item.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                cursor={"pointer"}
                size={"sm"}
                name={user ? user.name : "Stanley"}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
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
                onChange={(e) => setSearch(e.target.value)}
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

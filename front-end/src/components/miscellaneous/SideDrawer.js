import React, { useState, useEffect } from "react";
import {
  Box,
  useToast,
  Tooltip,
  Text,
  Avatar,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Spinner,
} from "@chakra-ui/react";
import MailIcon from "@mui/icons-material/Mail";
import logo from "../../images/logo2.png";
import { ChatState } from "../../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { deleteUserNotifications } from "../helpers/methods";
import "../../components/styles.css";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";

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
      deleteUserNotifications(user._id, selectedChat._id);
      setRefetchUserInfo(!refetchUserInfo);
    } else {
    }
  }, [selectedChat, setSelectedChat]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const selectChatByID = (chatId) => {
    const foundChat = chats.filter((s) => s._id === chatId);
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

  const items = [
    {
      label: (
        <ProfileModal user={user}>
          <div
            className="h-10 justify-center flex items-center text-base
          -mx-4 -my-1 z-100 px-4 rounded-md hover:bg-slate-500 hover:-z-50
          "
          >
            My Profile
          </div>
        </ProfileModal>
      ),
      key: "0",
    },
    {
      label: (
        <div
          onClick={logoutHandler}
          className="h-10 flex justify-center items-center text-base
          -mx-4 -my-1 px-4 rounded-md hover:bg-slate-500"
        >
          Logout
        </div>
      ),
      key: "1",
    },
  ];

  const mapnotificationItems = () => {
    if (userNotfications.length) {
      return userNotfications.map((item, index) => ({
        key: index,
        label: (
          <div
            className="
            flex justify-center items-center text-base
            h-8 -mx-4 -my-1 px-4 rounded-md hover:bg-slate-500"
            onClick={() => {
              selectChatByID(item.chatId);
              deleteUserNotifications(user._id, item.chatId);
              setUserNotifications(
                userNotfications.filter((n) => n.chatId != item.chatId)
              );
            }}
          >
            {"New message from " + item.sender}
          </div>
        ),
      }));
    } else {
      return [
        {
          key: 0,
          label: (
            <div
              className="
            flex justify-center items-center text-base
            h-8 -mx-4 -my-1 px-4 rounded-sm hover:bg-slate-500"
            >
              No new messages
            </div>
          ),
        },
      ];
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
          <SearchOutlined className="text-2xl text-gray-50" onClick={onOpen} />
        </Tooltip>
        <Text
          className="text-2xl flex items-center text-gray-50 font-semibold text-3xl ml-28"
          fontFamily="Work sans"
        >
          Nova-Chat
          <div>
            <img className="chat-logo" width="40rem" src={logo} alt="Logo" />
          </div>
        </Text>
        <div className=" items-center  ">
          <Dropdown
            placement="bottomRight"
            className="pb-3 "
            menu={{ items: mapnotificationItems() }}
            trigger={["click"]}
          >
            <a onClick={(e) => e.preventDefault()}>
              <button style={{ position: "relative" }} className=" mr-4 ">
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
                <div className=" h-full">
                  <MailIcon
                    className="text-gray-50 mx-5 mb-1"
                    style={{ zIndex: "10" }}
                  />
                </div>
              </button>
            </a>
          </Dropdown>

          <Dropdown
            placement="bottom"
            className="pb-3"
            menu={{ items }}
            trigger={["click"]}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Avatar
                cursor={"pointer"}
                size={"sm"}
                name={user ? user.name : "Stanley"}
              />
              <DownOutlined className="text-gray-50 mt-2" />
            </a>
          </Dropdown>
        </div>
      </Box>
      <Drawer
        placement="left"
        className="bg-gray-800"
        onClose={onClose}
        isOpen={isOpen}
      >
        <DrawerOverlay className="bg-gray-800" />
        <DrawerContent backgroundColor={"#27272a"}>
          <DrawerHeader
            borderColor={"black"}
            borderBottomWidth="1px"
          ></DrawerHeader>
          <DrawerBody>
            <div className="flex pb-2">
              <input
                className="custom-input bg-slate-700 border border-black pl-2 w-full rounded-md mr-1 text-gray-100"
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
              <button className="group-chat-btn" onClick={handleSearch}>
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
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

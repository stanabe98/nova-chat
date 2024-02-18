import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  Box,
  FormControl,
  Spinner,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import UserProfileItem from "../UserAvatar/UserProfileItem";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import CustomInput from "./CustomInput";
import "../../components/styles.css";
import { UserOutlined } from "@ant-design/icons";

const UpdateGroupChatModal = ({ refetch, setRefetch, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();
  const { user, selectedChat, setSelectedChat, getConfig } = ChatState();

  const handleRemoveUser = async (usertoRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      usertoRemove._id !== user._id
    ) {
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: usertoRemove._id,
        },
        getConfig(user)
      );

      usertoRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);

      setRefetch(!refetch);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Ocurred",
        status: error.response.data.message,
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleAddUser = async (usertoAdd) => {
    if (selectedChat.users.find((u) => u._id === usertoAdd._id)) {
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add users to group",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }

    try {
      setLoading(true);

      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          newUserId: usertoAdd._id,
        },
        getConfig(user)
      );

      setSelectedChat(data);
      setRefetch(!refetch);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Ocurred",
        status: error.response.data.message,
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
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
        description: "Failed retreive search results",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);

      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        getConfig(user)
      );

      setSelectedChat(data);
      setRefetch(!refetch);
      setRenameLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }

    setGroupChatName("");
  };

  return (
    <>
      <UserOutlined className="hover:scale-105" onClick={onOpen} />
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setSearchResult([]);
          onClose();
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
            className="flex justify-center bg-slate-800 text-slate-100"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col items-center bg-gray-300">
            <Box
              width="100%"
              display={"flex"}
              flexWrap={"wrap"}
              paddingBottom={3}
            >
              {selectedChat.users.map((u) => (
                <UserProfileItem
                  key={user._id}
                  user={u}
                  handleFunction={() => handleRemoveUser(u)}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <CustomInput
                moreStyles={"mb-3 w-full"}
                placeholder="Chat Name"
                value={groupChatName}
                visible={true}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                backgroundColor={"#0e7490"}
                color={"#e5e7eb"}
                className="border border-transparent"
                _hover={{ bg: "#0e7490", borderColor: " #4096ff" }}
                marginLeft={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <CustomInput
                placeholder="Add user to group"
                onChange={(e) => {
                  if (e.target.value.trim() === "") {
                    setSearchResult([]);
                    return;
                  }
                  handleSearch(e.target.value);
                }}
                visible={true}
                moreStyles={"mb-1"}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleAddUser(u)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter className="bg-gray-300 text-slate-100">
            <button
              className="group-leave-btn"
              onClick={() => handleRemoveUser(user)}
            >
              Leave Group
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;

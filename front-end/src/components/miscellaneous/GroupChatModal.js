import React, { useState } from "react";
import {
  useDisclosure,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  ModalContent,
  useToast,
  FormControl,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserProfileItem from "../UserAvatar/UserProfileItem";
import "../../components/styles.css";
import CustomInput from "./CustomInput";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats, getConfig } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);

      const { data } = await axios.get(
        `/api/user?search=${search}`,
        getConfig(user)
      );

      setLoading(false);
      setSearchResults(data);
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

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        getConfig(user)
      );

      setChats([data, ...chats]);
      setSearchResults([])
      setSelectedUsers([])
      onClose();
      toast({
        title: "New group chat created",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to create the chat",
        description: error.response.data,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  
  const handleDelete = (deleteUser) => {
    const uppdatedUser = selectedUsers.filter((s) => s._id !== deleteUser._id);
    setSelectedUsers(uppdatedUser);
  };

  const addUserToGroup= (addedUser)=>{

    const isUserInGroup = selectedUsers.some(
      (user) => user.email === addedUser.email
    );
    if(isUserInGroup){
      return
    }else{
      setSelectedUsers([...selectedUsers, addedUser]);
    }

  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            className="flex justify-center bg-slate-800 text-slate-100"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            className="flex flex-col items-center bg-gray-300
  
          "
          >
            <FormControl>
              <CustomInput
                moreStyles={"mt-1 mb-1"}
                placeholder="Chat name"
                visible={true}
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <CustomInput
                moreStyles={"mt-1 mb-1"}
                placeholder="Add Users"
                visible={true}
                onChange={(e) => {
                  if (e.target.value.trim() === "") {
                    setSearchResults([]);
                  } else {
                    handleSearch(e.target.value);
                  }
                }}
              />
            </FormControl>
            <Box className="flex w-full flex-wrap">
              {selectedUsers.map((u) => (
                <UserProfileItem
                  key={user._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {loading ? (
              <Spinner marginLeft="auto" display="flex" />
            ) : (
              searchResults
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => addUserToGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter className="bg-gray-300 text-slate-100">
            <button className="group-chat-btn" onClick={handleSubmit}>
              Create Chat
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;

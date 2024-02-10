import React from "react";
import { Box, Avatar, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor={"pointer"}
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      className="flex w-full items-center px-2 py-2 mb-2 rounded-lg"
      color={"black"}
    >
      <Avatar
        marginRight={2}
        size={"sm"}
        cursor={"pointer"}
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text className="text-xs"><b>
            Email:
            </b>{user.email}</Text>
      </Box>
    </Box>
  );
};

export default UserListItem;

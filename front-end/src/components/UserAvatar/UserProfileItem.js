import React from "react";
import { Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";


const UserProfileItem = ({ user, handleFunction }) => {
  return (
    <Box
      className="px-2 py-2 rounded-lg m-1 mb-2 cursor-pointer"
    //   colorScheme={"pink"}
      fontSize={12}
      onClick={handleFunction}
      backgroundColor={"pink"}
      color={"white"}
    >
      {user.name}
      <CloseIcon className="pl-1"/>
    </Box>
  );
};

export default UserProfileItem;

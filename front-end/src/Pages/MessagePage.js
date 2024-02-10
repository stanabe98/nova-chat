import axios from "axios";
import {Box} from "@chakra-ui/react"
import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const MessagePage = () => {
  const { user } = ChatState();
  const [refetch , setRefetch]= useState(false)

  useEffect(()=>{
    console.log(user)
  },[])
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box className="flex justify-between" width={"100%"} height="92vh" padding={"10px"}>
        {user && <MyChats refetch={refetch} />}
        {user && <ChatBox refetch={refetch} setRefetch={setRefetch} />}
      </Box>
    </div>
  );
};

export default MessagePage;

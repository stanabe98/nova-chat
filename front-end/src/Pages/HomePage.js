import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo2.png";
import "../components/styles.css";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container
      maxW="xl"
      className="bg-black  shadow-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30"
      centerContent
    >
      <Box
        display="flex"
        justifyContent={"center"}
        className="border-black items-center shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30"
        p={3}
        w="100%"
        m="40px 0 15px 0"
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Text
          fontSize={"4xl"}
          fontFamily={"work sans"}
          className="text-gray-200"
        >
          Nova-Chat
        </Text>
        <div className="ml-1 ">
          <img className="chat-logo" width="40rem" src={logo} alt="Logo" />
        </div>
      </Box>
      <Box
        className=" w-full rounded-lg p-4 border-black shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30"
        color={"black"}
        borderWidth={"1px"}
      >
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab className="w-1/2">Login</Tab>

            <Tab className="w-1/2">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;

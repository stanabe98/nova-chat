import React , {useEffect,useState}from "react";
import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import {useNavigate} from "react-router-dom"

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("userInfo"));
    
      if (user) {
        navigate("/chats");
      }
    }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent={"center"}
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Text fontSize={"4xl"} fontFamily={"work sans"} color={"black"}>
          Nova-Chat
        </Text>
      </Box>
      <Box
        className="bg-white w-full rounded-lg p-4"
        color={"black"}
        borderWidth={"1px"}
      >
        <Tabs variant="soft-rounded" colorScheme="cyan">
          <TabList mb="1em">
            <Tab className="w-1/2">Login</Tab>
            <Tab className="w-1/2">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
           
              <Login/>
            </TabPanel>
            <TabPanel>
         
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;

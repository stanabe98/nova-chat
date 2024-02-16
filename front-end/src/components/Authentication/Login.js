import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../components/styles.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login successful",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      submitHandler();
    }
  };

  return (
    <>
      <div spacing={"5px"} color={"black"}>
        <form id="email">
          <label className="required text-sky-200">Email</label>
          <Input
            className="p-2 text-gray-200 border-black bg-slate-700 hover:bg-slate-700 mt-1 mb-1"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </form>
        <form id="password">
          <label className="required text-sky-200">Password</label>

          <Input.Password
            className="p-2 text-gray-200  border-black  bg-slate-700 hover:bg-slate-700 mt-1 mb-1"
            placeholder="Password"
            value={password}
            onKeyDown={handleKeyDown}
            onChange={(e) => setPassword(e.target.value)}
          />
        </form>

        <Button
          className=" flex w-full border-black border rounded-md mt-4 py-5 items-center justify-center"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Login
        </Button>
        <Button
          className=" w-full flex border-black border rounded-md mt-4 py-5 items-center justify-center"
          onClick={() => {
            setEmail("guest@example.com");
            setPassword("password123");
          }}
        >
          Guest User
        </Button>
      </div>
    </>
  );
};

export default Login;

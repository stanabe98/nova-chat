import React, { useState } from "react";
import { VStack, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "../../components/styles.css";


const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const postDetails = (pics) => {
    setLoading(true);
    if (pics == undefined) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    const uploadEndpoint = `https://api.cloudinary.com/v1_1/abystant/image/upload`;

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "nova-chat");
      data.append("cloud_name", "abystant");
      fetch(uploadEndpoint, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "api/user",
        { name, email, password, pic },
        config
      );

      toast({
        title: "Registration successful",
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

  return (
    <div spacing={"5px"} color={"black"}>
      <form id="first-name">
        <label className="required text-sky-200">Name</label>
        <Input
          placeholder="Name"
          className="p-2 text-gray-200 border-black bg-slate-700 hover:bg-slate-700 mt-1 mb-1"
          onChange={(e) => setName(e.target.value)}
        />
      </form>
      <form id="email">
        <label className="required text-sky-200">Email</label>

        <Input
          placeholder="Email"
          className="p-2 text-gray-200 border-black bg-slate-700 hover:bg-slate-700 mt-1 mb-1"
          onChange={(e) => setEmail(e.target.value)}
        />
      </form>
      <form id=" password">
        <label className="required text-sky-200">Password</label>

        <Input.Password
          className="p-2 text-gray-200 border-black bg-slate-700 hover:bg-slate-700 mt-1 mb-1"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </form>
      <form id="confirm-password">
        <label className="required text-sky-200">Confirm Password</label>

        <Input.Password
          placeholder="Confirm Password"
          className="p-2 text-gray-200 border-black bg-slate-700 hover:bg-slate-700 mt-1  "
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </form>
      <form id="pic">
        <label for="uploadInput" className=" uploadBtn text-sky-200">
          Upload your picture <UploadOutlined></UploadOutlined>
        </label>
        <label className="required"></label>
        <input
          type={"file"}
          id="uploadInput"
          className=" p-2 customUpload text-gray-200 border-none bg-slate-700 hover:bg-slate-700"
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </form>
      <Button
        className=" w-full flex border-black border rounded-md mt-4 py-5 items-center justify-center"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </div>
  );
};

export default Signup;

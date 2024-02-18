import React from "react";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton, Image, Text
} from "@chakra-ui/react";
import {InfoCircleOutlined} from "@ant-design/icons"
import "../../components/styles.css"

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <InfoCircleOutlined className="hover:scale-105" onClick={onOpen} />
      )}
      <Modal size={"lg"} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent height={"450px"}>
          <ModalHeader
            fontSize="45px"
            fontFamily="Work sans"
            className="flex justify-center
              bg-zinc-800 text-gray-100
            
            "
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            className="flex flex-col items-center justify-between
            bg-zinc-800 text-gray-100
          
          "
          >
            <Image
              borderRadius={"full"}
              boxSize={"150px"}
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter className=" bg-zinc-800">
            <button
              className="group-chat-btn text-xl text-gray-200"
              style={{ paddingInline: "1rem" }}
              mr={3}
              onClick={onClose}
            >
              Close
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;

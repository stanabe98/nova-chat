import React from "react";
import {
  useDisclosure,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button, Image, Text
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal size={"lg"} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent height={"450px"}>
          <ModalHeader
            fontSize="45px"
            fontFamily="Work sans"
            className="flex justify-center"
          >
            { user.name }
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex flex-col items-center justify-between">
            <Image
              borderRadius={"full"}
              boxSize={"150px"}
              src={
                user.pic
              }
              alt={user.name }
            />
            <Text fontSize={{base:"28px", md:"30px"}}
                fontFamily="Work sans"
            >
                Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;

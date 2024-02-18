import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { Tooltip, Avatar } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import "../components/styles.css";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed
      className="scrollable-div 
    
    pb-5
    
    "
    >
      {messages &&
        messages.map((m, i) => (
          <div key={m._id} className="flex">
            {isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id) ? (
              <Tooltip label={m.sender.name} placement={"top"} hasArrow>
                <div className="w-13 h-2">
                  <Avatar
                    className="mt-[7px] mr-1 text-sm cursor-pointer "
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </div>
              </Tooltip>
            ) : (
              <div className="w-5"></div>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#c7d2fe"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),

                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,

                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "50%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;

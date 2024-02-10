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

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div key={m._id} className="flex">
            {isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id) ? (
              <Tooltip
                label={m.sender.name}
                placement={"bottom-start"}
                hasArrow
              >
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
                // marginLeft: m.sender._id === user._id ? 0:433,

                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
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

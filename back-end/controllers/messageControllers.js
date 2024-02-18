const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const { getReceiverSocketId, io } = require("../socket/socket");

const sendMessage = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
   
    return res.sendStatus(400);
  }
  const chatUsers = await Chat.findById(chatId);
  const currentChat = await Chat.findById(chatId).populate("users");

  const isSenderinChat = currentChat.users.some(
    (u) => u._id.toString() === req.user._id.toString()
  );

  if (!isSenderinChat) {
    res.status(401);
    throw new Error("You are not a chat participant");
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    //send notification
    const otherUsers = chatUsers.users.filter(
      (u) => u.toString() !== req.user._id.toString()
    );

    if (currentChat.isGroupChat) {
      await User.where("_id")
        .in(otherUsers)
        .updateMany({
          $addToSet: {
            notifications: { chatId: chatId, sender: currentChat.chatName },
          },
        });
    } else {
      await User.where("_id")
        .in(otherUsers)
        .updateMany({
          $addToSet: {
            notifications: { chatId: chatId, sender: req.user.name },
          },
        });
    }

    currentChat.users.forEach((u) => {
     
      const receiverSocketId = getReceiverSocketId(u._id);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", message);
      }
    });

    // chatUsers.users.forEach((userId) => {
    //   console.log("userid", userId);
    //   const receiverSocketId = getReceiverSocketId(userId);
    //   if (receiverSocketId) {
    //     io.to(receiverSocketId).emit("newMessage", message);
    //   }
    // });

    res.json(message);
  } catch (error) {

    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };

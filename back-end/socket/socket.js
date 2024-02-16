const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

const userSocketMap = {};

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId != undefined) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on(
    "typing",
    ({
      currentUserId,
      currentUserName,
      selectedChatId,
      selectedChatUserIds,
    }) => {
      const otherUsers = selectedChatUserIds.filter((u) => u !== currentUserId);

      if (otherUsers.length == 1) {
        const receiverSocketId = getReceiverSocketId(otherUsers);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("userTyping", {
            currentUserName,
            selectedChatId,
          });
        }
      } else {
        otherUsers.forEach((user) => {
          const receiverSocketId = getReceiverSocketId(user);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("userTyping", {
              currentUserName,
              selectedChatId,
            });
          }
        });
      }
    }
  );

  socket.on(
    "stoptyping",
    ({
      currentUserId,
      currentUserName,
      selectedChatId,
      selectedChatUserIds,
    }) => {
      const otherUsers = selectedChatUserIds.filter((u) => u !== currentUserId);

      if (otherUsers.length == 1) {
        const receiverSocketId = getReceiverSocketId(otherUsers);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("userstopTyping", {
            currentUserName,
            selectedChatId,
          });
        }
      } else {
        otherUsers.forEach((user) => {
          const receiverSocketId = getReceiverSocketId(user);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("userstopTyping", {
              currentUserName,
              selectedChatId,
            });
          }
        });
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { getReceiverSocketId, io, server, app };

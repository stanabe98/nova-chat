const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { app, server, io } = require("./socket/socket");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB(process.env.MONGO_URI);

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ------------------Deployment-------------------

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/front-end/build")));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname1, "front-end", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}

// ------------------Deployment-------------------

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

server.listen(PORT, console.log(`server is running on ${PORT}`.yellow));

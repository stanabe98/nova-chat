const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  let user;

  if (pic) {
    user = await User.create({
      name,
      email,
      password,
      pic,
    });
  } else {
    user = await User.create({
      name,
      email,
      password,
    });
  }

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the User");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invaild email or password");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const getUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const currentUser = await User.findById(userId.toString()).select(
    "-password"
  );
  console.log(currentUser);
  res.send(currentUser);
});

const getUserNotifications = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

const postUserNotifications2 = asyncHandler(async (req, res) => {
  const { chatId } = req.body;
  const senderId = req.user._id.toString();

  try {
    const findChat = await Chat.findById(chatId).populate("users", "-password");
    if (!findChat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const chatUsers = findChat.users;
    await Promise.all(
      chatUsers.map(async (user) => {
        if (user._id.toString() !== senderId) {
          if (!user.notifications.includes(chatId)) {
            console.log(user.notifications);

            await User.findByIdAndUpdate(user._id.toString(), {
              $push: { notifications: chatId },
            });
          }
        }
      })
    );

    res.send(findChat.users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const postUserNotifications = asyncHandler(async (req, res) => {
  const { chatId } = req.body;
  const senderId = req.user._id.toString();

  try {
    const findChat = await Chat.findById(chatId).populate("users", "-password");
    if (!findChat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const chatUsers = findChat.users;
    const userIds = chatUsers.map((user) => user._id.toString());

    console.log("executing");
    const expected = await User.where("_id")
      .in(userIds)
      .updateMany({ $addToSet: { notifications: chatId } });

    res.send(expected);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const deleteUserNotifications = asyncHandler(async (req, res) => {
  const { chatIds } = req.body;

  const userId = req.user._id;

  const result = await User.updateOne(
    { _id: userId },
    { $pull: { notifications: { chatId: { $in: chatIds } } } }
  );

  res.json({ message: "Notifications deleted successfully", result });
});

const deleteUserNotifications2 = asyncHandler(async (req, res) => {
  try {
    const { chatIds } = req.body;
    const userId = req.params.userId;

    const result = await User.updateOne(
      { _id: userId },
      { $pull: { notifications: { chatId: { $in: chatIds } } } }
    );

    res.json({ message: "Notifications deleted successfully", result });
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
  getUser,
  getUserNotifications,
  postUserNotifications,
  deleteUserNotifications,
  deleteUserNotifications2,
};

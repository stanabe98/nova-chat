const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  postUserNotifications,
  deleteUserNotifications,
  deleteUserNotifications2,
  getUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
router.route("/notifications").post(protect, postUserNotifications);
router.route("/notifications").delete(protect, deleteUserNotifications);
router.route("/currentuser").get(protect, getUser);
router.route("/notifications/:userId").delete(deleteUserNotifications2);

module.exports = router;

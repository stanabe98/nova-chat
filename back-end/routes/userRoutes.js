const express = require('express');
const {registerUser, authUser, allUsers} = require("../controllers/userController")
const {protect} = require("../middleware/authMiddleware")

const router = express.Router();

router.route('/').post(registerUser).get(protect,allUsers);
router.post('/login', authUser);
router.route("/notifications").post(protect,authUser);




module.exports = router;
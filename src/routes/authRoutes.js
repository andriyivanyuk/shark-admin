const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

const authenticate = require("../middleware/authenticate");

router.post("/register", usersController.registerUser);
router.post("/logout", authenticate, usersController.logoutUser);
router.post("/login", usersController.loginUser);
router.post("/refresh", usersController.refreshToken);

module.exports = router;

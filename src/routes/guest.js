const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const authController = require("../controllers/authController");
const auth = require("../middlewares/guestAuth");

router.post(
  "/guest/result",
  auth.guestAuthMiddleware,
  usersController.createResultById
);
router.post("/guest", usersController.createGuest);
router.post("/guest/signup", auth.guestAuthMiddleware, authController.signup);
module.exports = router;

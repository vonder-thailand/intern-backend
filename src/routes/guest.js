const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const auth = require("../middlewares/guestAuth");

router.post("/guest/result", usersController.createResultById);
router.post("/guest", auth.guestAuthMiddleware, usersController.createGuest);
module.exports = router;

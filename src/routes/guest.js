const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const auth = require("../middlewares/auth");

router.post("/guest/result", usersController.createResultById);
router.post("/guest", usersController.createGuest);

module.exports = router;

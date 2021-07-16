const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guestController");
const { tryCatch } = require("../middlewares/tryCatchController");

//POST
router.post("/guest/result", tryCatch(guestController.calculateResult));

module.exports = router;

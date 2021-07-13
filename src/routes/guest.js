const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guestController");

//POST
router.post("/guest/result", guestController.calculateResult);

module.exports = router;

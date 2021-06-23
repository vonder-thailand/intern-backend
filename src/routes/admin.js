const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middlewares/authVerify");

router.get("/results", adminController.getAllResult);
router.get("/admin/find", auth.authMiddleware, adminController.getAdminById);
router.get("/admin", auth.authMiddleware, adminController.getAllAdmins);
router.post("/questions", auth.authMiddleware, adminController.postQuestion);
router.get("/questions", adminController.getAllQuestions);
router.get("/questions/cat", adminController.getQuestionByCat);
router.put("/update", adminController.updateFields);

module.exports = router;

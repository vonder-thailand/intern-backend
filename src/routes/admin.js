const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middlewares/auth");

router.get("/results", auth.authMiddleware, adminController.getAllResult);
router.get("/admin/find", auth.authMiddleware, adminController.getAdminById);
router.get("/admin", auth.authMiddleware, adminController.getAllAdmins);
router.post("/questions", adminController.postQuestion);
router.get("/questions", adminController.getAllQuestions);
router.get(
  "/questions/cat",
  auth.authMiddleware,
  adminController.getQuestionByCat
);
router.put("/update", auth.authMiddleware, adminController.updateFields);

module.exports = router;

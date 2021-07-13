const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const auth = require("../middlewares/auth");

router.get("/results", auth.authMiddleware, adminController.getAllResult);
router.get("/admin/find", auth.authMiddleware, adminController.getAdminById);
router.get("/admin", auth.authMiddleware, adminController.getAllAdmins);
router.get("/questions", adminController.getAllQuestions);
router.get(
  "/questions/cat",
  auth.authMiddleware,
  adminController.getQuestionByCat
);
router.get("/summarize", auth.authMiddleware, adminController.getSummarise);
router.post("/questions", adminController.postQuestion);
router.post("/summarize", auth.authMiddleware, adminController.postSummarise);
router.put("/update", auth.authMiddleware, adminController.updateFields);

module.exports = router;

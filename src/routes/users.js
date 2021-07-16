const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const auth = require("../middlewares/auth");
const multer = require("multer");

//GET
router.get("/user/find", auth.authMiddleware, usersController.findUserById);
router.get("/user", auth.authMiddleware, usersController.getAllUsers);
router.get(
  "/user/content/get",
  auth.authMiddleware,
  usersController.getAllContents
);
router.get(
  "/user/comment/get/:page-:limit/:contentId",
  auth.authMiddleware,
  usersController.getCommentByContentId
);
router.get(
  "/user/search/:keyword",
  auth.authMiddleware,
  usersController.search
);
router.get(
  "/user/newResult",
  auth.authMiddleware,
  usersController.getNewResult
);
router.get(
  "/user/content",
  auth.authMiddleware,
  usersController.getContentById
);

router.get(
  "/user/contentID/:_id",
  auth.authMiddleware,
  usersController.getContentByContentId
);

router.get(
  "/user/newestContent",
  auth.authMiddleware,
  usersController.getNewestContent
);

router.get("/user/profile", auth.authMiddleware, usersController.getProfile);

//POST
router.post(
  "/images",
  auth.authMiddleware,
  multer({ dest: "uploads/" }).array("photo", 10),
  usersController.postImage
);

router.post("/comment", auth.authMiddleware, usersController.postComment);

router.post("/user/content", auth.authMiddleware, usersController.postContent);

router.post(
  "/user/content/tag",
  auth.authMiddleware,
  usersController.getSortByTag
);

router.post(
  "/user/newResult",
  auth.authMiddleware,
  usersController.postNewResult
);

router.put(
  "/user/content",
  auth.authMiddleware,
  usersController.contentIsLiked
);

//PUT
router.put("/user", auth.authMiddleware, usersController.updateUserById);

router.delete("/user", auth.authMiddleware, usersController.deleteUserById);

//DELETE
router.delete(
  "/user/comment",
  auth.authMiddleware,
  usersController.deleteComment
);
router.delete(
  "/user/content",
  auth.authMiddleware,
  usersController.deleteContent
);

router.get(
  "/user/content/sort/like/:page-:limit",
  auth.authMiddleware,
  usersController.getSortedContentByLike
);

module.exports = router;

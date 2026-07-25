const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { verifyToken } = require("../middleware/auth");
const checkBanStatus = require("../middleware/checkBanStatus");

router.get("/post/:postId", commentController.getByPostId);
router.post(
  "/post/:postId",
  verifyToken,
  checkBanStatus,
  commentController.createPostComment,
);

router.get(
  "/project/:projectId",
  verifyToken,
  checkBanStatus,
  commentController.getByProjectId,
);
router.post(
  "/project/:projectId",
  verifyToken,
  checkBanStatus,
  commentController.createProjectComment,
);

router.delete("/:id", verifyToken, checkBanStatus, commentController.delete);

module.exports = router;

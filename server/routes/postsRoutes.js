const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const { verifyToken, checkRole } = require("../middleware/auth");
const checkBanStatus = require("../middleware/checkBanStatus");
const upload = require("../middleware/upload");

router.get("/", postController.getAll);

router.post(
  "/create",
  verifyToken,
  checkBanStatus,
  checkRole(["admin", "content-manager", "superadmin"]),
  upload.array("coverImage", 5),
  postController.create,
);

router.get("/:id", postController.getById);

router.put(
  "/:id",
  verifyToken,
  checkBanStatus,
  checkRole(["admin", "content-manager", "superadmin"]),
  upload.array("coverImage", 5),
  postController.update,
);

router.delete(
  "/:id",
  verifyToken,
  checkBanStatus,
  checkRole(["admin", "superadmin", "content-manager"]),
  postController.delete,
);

router.post(
  "/:id/react",
  verifyToken,
  checkBanStatus,
  postController.toggleReaction,
);

router.get("/:id/comments", commentController.getByPostId);

router.post(
  "/:id/comment",
  verifyToken,
  checkBanStatus,
  commentController.create,
);

router.delete(
  "/comment/:commentId",
  verifyToken,
  checkBanStatus,
  commentController.delete,
);

module.exports = router;

const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { verifyToken, checkRole } = require("../middleware/auth");
const checkBanStatus = require("../middleware/checkBanStatus");
const upload = require("../middleware/upload");

router.get("/", postController.getAll);
router.post(
  "/create",
  verifyToken,
  checkBanStatus,
  checkRole(["admin", "content-manager", "superadmin"]),
  upload.single("image"),
  postController.create,
);

router.get("/:id", postController.getById);

router.put(
  "/:id",
  verifyToken,
  checkBanStatus,
  checkRole(["admin", "content-manager", "superadmin"]),
  upload.single("image"),
  postController.update,
);
router.delete(
  "/:id",
  verifyToken,
  checkBanStatus,
  checkRole(["admin", "superadmin"]),
  postController.delete,
);

router.post(
  "/:id/comment",
  verifyToken,
  checkBanStatus,
  postController.addComment,
);
router.delete(
  "/:postId/comment/:commentId",
  verifyToken,
  checkBanStatus,
  postController.deleteComment,
);
router.post(
  "/:id/react",
  verifyToken,
  checkBanStatus,
  postController.toggleReaction,
);

module.exports = router;

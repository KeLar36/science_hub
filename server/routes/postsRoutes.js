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
  upload.array("coverImage", 5),
  postController.create,
);

router.get(
  "/my-dashboard",
  verifyToken,
  checkBanStatus,
  checkRole(["admin", "content-manager", "superadmin"]),
  postController.getMyContentDashboard,
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

module.exports = router;

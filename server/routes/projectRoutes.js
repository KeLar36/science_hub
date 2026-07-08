const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { verifyToken, checkRole } = require("../middleware/auth");
const checkProjectAdminAccess = require("../middleware/checkProjectAdminAccess");

router.get("/archive", projectController.getArchive);
router.get("/", verifyToken, projectController.getAll);
router.get("/my", verifyToken, projectController.getMyProjects);
router.post("/", verifyToken, checkRole(["user"]), projectController.create);
router.get("/:id", verifyToken, projectController.getById);

router.post(
  "/:id/version",
  verifyToken,
  checkRole(["user"]),
  projectController.uploadNewVersion,
);
router.patch(
  "/:id/assign",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  checkProjectAdminAccess,
  projectController.assignReviewer,
);
router.patch(
  "/:id/review",
  verifyToken,
  checkRole(["reviewer", "admin", "superadmin"]),
  projectController.submitReview,
);
router.delete("/:id", verifyToken, projectController.delete);

module.exports = router;

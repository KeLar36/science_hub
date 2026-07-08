const express = require("express");
const router = express.Router();
const programController = require("../controllers/programController");
const { verifyToken, optionalToken, checkRole } = require("../middleware/auth");
const checkOrgAccess = require("../middleware/checkOrgAccess");

router.get("/", programController.getAll);
router.get("/public", programController.getPublicPrograms);
router.get("/admin/all", verifyToken, programController.getAll);
router.get(
  "/archive",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  checkOrgAccess,
  programController.getArchive,
);
router.post(
  "/",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  checkOrgAccess,
  programController.create,
);
router.put(
  "/:id",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  checkOrgAccess,
  programController.update,
);
router.patch(
  "/:id/toggle-status",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  checkOrgAccess,
  programController.toggleStatus,
);
router.delete(
  "/:id/permanent",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  checkOrgAccess,
  programController.deletePermanent,
);
router.get("/:id", programController.getById);

module.exports = router;

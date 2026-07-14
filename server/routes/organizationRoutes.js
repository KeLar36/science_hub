const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organizationController");
const { verifyToken, checkRole } = require("../middleware/auth");
const checkOrgAccess = require("../middleware/checkOrgAccess");
const upload = require("../middleware/upload");

router.get(
  "/public/list",
  upload.single("logo"),
  organizationController.getPublicList,
);
router.post("/create", verifyToken, organizationController.create);
router.post("/join", verifyToken, organizationController.joinRequest);
router.post("/leave", verifyToken, organizationController.leave);

router.get(
  "/requests/pending",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  organizationController.getPendingRequests,
);

router.get(
  "/all",
  verifyToken,
  checkRole(["superadmin"]),
  organizationController.getAll,
);

router.post(
  "/requests/accept/:userId",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  organizationController.acceptRequest,
);

router.post(
  "/requests/reject/:userId",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  organizationController.rejectRequest,
);

router.get(
  "/:id/users",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  checkOrgAccess,
  organizationController.getOrganizationUsers,
);

router.get(
  "/:id/programs",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  organizationController.getOrganizationPrograms,
);

router.post(
  "/:id/kick",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  organizationController.kick,
);

router.patch(
  "/:id/status",
  verifyToken,
  checkRole(["superadmin"]),
  organizationController.updateStatus,
);

router.patch(
  "/:id/transfer-ownership",
  verifyToken,
  organizationController.transferOrgOwnership,
);

router.get("/:id", verifyToken, organizationController.getById);

router.delete(
  "/:id",
  verifyToken,
  checkRole(["superadmin", "admin"]),
  organizationController.delete,
);

module.exports = router;

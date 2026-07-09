const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organizationController");
const { verifyToken, checkRole } = require("../middleware/auth");

router.get("/public/list", organizationController.getPublicList);
router.post("/create", verifyToken, organizationController.create);
router.post("/join", verifyToken, organizationController.requestToJoin);
router.get(
  "/all",
  verifyToken,
  checkRole(["superadmin"]),
  organizationController.getAll,
);

router.get(
  "/requests/pending",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  organizationController.getPendingRequests,
);

router.post(
  "/requests/accept/:userId",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  organizationController.acceptJoinRequest,
);

router.post(
  "/requests/reject/:userId",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  organizationController.rejectJoinRequest,
);

router.get(
  "/:id/users",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  organizationController.getOrganizationUsers,
);

router.get(
  "/:id/programs",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  organizationController.getOrganizationPrograms,
);

router.get("/:id", verifyToken, organizationController.getById);

router.patch(
  "/:id/status",
  verifyToken,
  checkRole(["superadmin"]),
  organizationController.updateStatus,
);

module.exports = router;

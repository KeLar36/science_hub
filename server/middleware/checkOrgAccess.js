const mongoose = require("mongoose");
const User = require("../models/User");

const checkOrgAccess = async (req, res, next) => {
  try {
    if (req.user.role === "superadmin") return next();

    if (req.user.role === "admin") {
      const freshUser = await User.findById(req.user.id).select(
        "organizationId",
      );

      if (!freshUser || !freshUser.organizationId) {
        return res.status(403).json({
          error:
            "Ваш профіль не прив'язано до жодної організації. Дія заборонена.",
        });
      }

      req.user.organizationId = freshUser.organizationId;

      if (req.params.id && req.baseUrl.includes("programs")) {
        const ProgramModel = mongoose.model("Program");
        const program = await ProgramModel.findById(req.params.id);

        if (!program) {
          return res.status(404).json({ error: "Програму не знайдено" });
        }

        if (
          !program.organizationId ||
          String(program.organizationId) !== String(freshUser.organizationId)
        ) {
          return res.status(403).json({
            error: "Ви можете керувати тільки програмами вашої організації",
          });
        }
      }

      return next();
    }

    return res.status(403).json({ error: "Недостатньо прав." });
  } catch (err) {
    next(err);
  }
};

module.exports = checkOrgAccess;

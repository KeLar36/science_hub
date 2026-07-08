const Project = require("../models/Project");
const Program = require("../models/Program");

const checkProjectAdminAccess = async (req, res, next) => {
  try {
    if (req.user.role === "superadmin") return next();

    if (req.user.role === "admin") {
      const project = await Project.findById(req.params.id).populate(
        "programId",
      );
      if (!project) {
        return res.status(404).json({ error: "Проєкт не знайдено" });
      }

      if (
        !project.programId.organizationId ||
        project.programId.organizationId.toString() !==
          req.user.organizationId.toString()
      ) {
        return res
          .status(403)
          .json({ error: "Цей проєкт належить програмі іншої організації" });
      }

      return next();
    }

    return res
      .status(403)
      .json({ error: "Недостатньо прав для керування проєктом" });
  } catch (err) {
    next(err);
  }
};

module.exports = checkProjectAdminAccess;

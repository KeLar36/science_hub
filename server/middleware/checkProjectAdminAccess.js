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

      const programOrgId = project.programId?.organizationId;
      const userOrgId = req.user.organizationId;

      if (!programOrgId || programOrgId.toString() !== userOrgId.toString()) {
        return res.status(403).json({
          error:
            "Доступ заборонено: цей проєкт належить конкурсу іншої установи",
        });
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

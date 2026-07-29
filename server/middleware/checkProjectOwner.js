const Project = require("../models/Project");

const checkProjectOwner = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Проєкт не знайдено" });
    }

    const isOwner = project.authorId.toString() === req.user.id.toString();
    const isSuperAdmin = req.user.role === "superadmin";

    if (!isOwner && !isSuperAdmin) {
      return res.status(403).json({
        error: "Доступ заборонено: ви не є автором цього проєкту",
      });
    }

    req.project = project;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkProjectOwner;

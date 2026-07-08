const projectService = require("../services/projectService");
const Program = require("../models/Program");

class ProjectController {
  async getAll(req, res, next) {
    try {
      let query = {};
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;

      if (req.user.role === "user") {
        query.authorId = req.user.id;
      } else if (req.user.role === "reviewer") {
        query.reviewerId = req.user.id;
      } else if (req.user.role === "admin") {
        const programs = await Program.find({
          organizationId: req.user.organizationId,
        }).select("_id");
        const programIds = programs.map((p) => p._id);
        query.programId = { $in: programIds };
      }

      if (req.query.search) {
        query.title = { $regex: req.query.search.trim(), $options: "i" };
      }

      if (req.query.status && req.query.status !== "Всі статуси") {
        query.status = req.query.status;
      }

      if (req.query.domain && req.query.domain !== "Всі галузі") {
        query.domain = req.query.domain;
      }

      const result = await projectService.getAll(query, page, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const project = await projectService.getById(req.params.id);

      if (
        req.user.role === "user" &&
        project.authorId._id.toString() !== req.user.id
      ) {
        return res.status(403).json({ error: "Доступ заборонено" });
      }

      res.json(project);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const {
        title,
        description,
        programId,
        fileUrl,
        fileName,
        authorComment,
        domain,
      } = req.body;

      if (!title || !description || !programId || !fileUrl) {
        return res.status(400).json({
          error: "Заповніть обов'язкові поля: назва, опис, програма та файл",
        });
      }

      const newProject = await projectService.create({
        title,
        description,
        domain,
        programId,
        authorId: req.user.id,
        fileUrl,
        fileName,
        authorComment,
      });

      res.status(201).json(newProject);
    } catch (err) {
      next(err);
    }
  }

  async uploadNewVersion(req, res, next) {
    try {
      const { fileUrl, fileName, authorComment } = req.body;

      if (!fileUrl) {
        return res
          .status(400)
          .json({ error: "Посилання на файл є обов'язковим" });
      }

      const project = await projectService.getById(req.params.id);
      if (project.authorId._id.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Ви можете оновлювати тільки власні проєкти" });
      }

      const updatedProject = await projectService.appendVersion(req.params.id, {
        fileUrl,
        fileName,
        authorComment,
      });

      res.json(updatedProject);
    } catch (err) {
      next(err);
    }
  }

  async assignReviewer(req, res, next) {
    try {
      const { reviewerId } = req.body;
      if (!reviewerId) {
        return res.status(400).json({ error: "Вкажіть ID рецензента" });
      }

      const updatedProject = await projectService.updateReview(req.params.id, {
        reviewerId,
        reviewStatus: "В процесі",
      });

      res.json(updatedProject);
    } catch (err) {
      next(err);
    }
  }

  async submitReview(req, res, next) {
    try {
      const { reviewerComments, status } = req.body;

      if (!status || !reviewerComments) {
        return res
          .status(400)
          .json({ error: "Вкажіть статус рішення та коментар" });
      }

      const project = await projectService.getById(req.params.id);
      if (
        req.user.role === "reviewer" &&
        project.reviewerId?._id.toString() !== req.user.id
      ) {
        return res
          .status(403)
          .json({ error: "Ви не є призначеним рецензентом для цього проєкту" });
      }

      const updatedProject = await projectService.updateReview(req.params.id, {
        reviewerComments,
        status,
        reviewStatus: "Завершено",
      });

      res.json(updatedProject);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const project = await projectService.getById(req.params.id);
      if (
        req.user.role !== "superadmin" &&
        project.authorId._id.toString() !== req.user.id
      ) {
        return res
          .status(403)
          .json({ error: "Ви не маєте прав на видалення цього проєкту" });
      }

      await projectService.delete(req.params.id);
      res.json({ message: "Проєкт успішно видалено" });
    } catch (err) {
      next(err);
    }
  }

  async getArchive(req, res) {
    try {
      const archiveProjects = await projectService.getPublicArchive();
      return res.status(200).json(archiveProjects);
    } catch (error) {
      console.error("💥 Помилка при отриманні архіву:", error);
      return res.status(500).json({
        message: "Не вдалося завантажити публічний архів матеріалів",
      });
    }
  }

  async getMyProjects(req, res) {
    try {
      const projects = await projectService.getMyProjects(req.user.id);
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: "Помилка сервера" });
    }
  }
}

module.exports = new ProjectController();

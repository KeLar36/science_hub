const mongoose = require("mongoose");
const projectService = require("../services/projectService");
const Program = require("../models/Program");
const Project = require("../models/Project");

class ProjectController {
  async getAll(req, res, next) {
    try {
      let query = {};
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;
      const skip = (page - 1) * limit;

      if (req.query.search) {
        query.title = { $regex: req.query.search.trim(), $options: "i" };
      }
      if (req.query.status && req.query.status !== "Всі статуси") {
        query.status = req.query.status;
      }
      if (req.query.domain && req.query.domain !== "Всі галузі") {
        query.domain = req.query.domain;
      }

      if (req.user.role === "user") {
        query.authorId = req.user.id;
      } else if (req.user.role === "reviewer") {
        query.reviewerId = req.user.id;
      } else if (req.user.role === "admin") {
        const currentOrgId = req.user.organizationId;

        if (!currentOrgId) {
          query = { _id: null };
        } else {
          const programs = await Program.find({
            organizationId: currentOrgId,
          }).select("_id");
          const programIds = programs.map((p) => String(p._id));

          const roleFilters = { programId: { $in: programIds } };

          query = { $and: [query, roleFilters] };
        }
      }

      const totalItems = await Project.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);

      const rawProjects = await Project.find(query)
        .populate("authorId", "name email organizationId")
        .populate("programId", "title type organizationId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const isSuperAdmin = req.user.role === "superadmin";
      const userOrgId = String(req.user.organizationId || "");

      const processedItems = rawProjects.map((project) => {
        const pObj = project.toObject();

        const programOrgId = String(
          pObj.programId?.organizationId || pObj.programId || "",
        );
        const isOurProgram = userOrgId && programOrgId === userOrgId;

        pObj.context = {
          isOurTargetProgram: isOurProgram,
          canManageAssessment: isOurProgram || isSuperAdmin,
        };

        return pObj;
      });

      return res.status(200).json({
        items: processedItems,
        projects: processedItems,
        currentPage: page,
        totalPages: totalPages || 1,
        totalItems,
      });
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

      if (!status || !reviewerComments || !reviewerComments.trim()) {
        return res.status(400).json({
          error: "Вкажіть статус рішення та заповніть експертний висновок",
        });
      }

      const project = await projectService.getById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Проєкт не знайдено" });
      }

      const assignedReviewerId = project.reviewerId?._id || project.reviewerId;
      if (
        req.user.role === "reviewer" &&
        String(assignedReviewerId || "") !== req.user.id
      ) {
        return res
          .status(403)
          .json({ error: "Ви не є призначеним рецензентом для цього проєкту" });
      }

      const updateData = {
        reviewerComments: reviewerComments.trim(),
        reviewStatus:
          status === "На доопрацюванні" ? "На доопрацюванні" : "Завершено",
      };

      if (status === "На доопрацюванні") {
        updateData.status = "На доопрацюванні";
        updateData.reviewerRecommendation = "Немає";
      } else if (["Прийнято", "Відхилено"].includes(status)) {
        updateData.reviewerRecommendation = status;
      } else {
        return res
          .status(400)
          .json({ error: "Передано некоректний статус рішення" });
      }

      const updatedProject = await projectService.updateReview(
        req.params.id,
        updateData,
      );

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

  async getReviewerQueue(req, res, next) {
    try {
      const reviewerId = req.user.id;

      const projects = await projectService.getReviewerQueue(reviewerId);

      res.json(projects);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProjectController();

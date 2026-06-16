const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const upload = require("../middleware/upload");
const mongoose = require("mongoose");
const { verifyToken, checkRole } = require("../middleware/auth");

router.post("/create", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const { title, description, programId, domain } = req.body;
    const authorId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: "Будь ласка, завантажте файл" });
    }

    const finalUrl = req.file.path;

    const newProject = new Project({
      title,
      description,
      authorId,
      programId,
      domain,
      fileUrl: finalUrl,
      versions: [
        {
          fileUrl: finalUrl,
          fileName: req.file.originalname,
          authorComment: "Перша подача роботи",
        },
      ],
      status: "На розгляді",
    });

    await newProject.save();
    res
      .status(201)
      .json({ message: "Проєкт успішно створено!", project: newProject });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.patch(
  "/revision/:id",
  verifyToken,
  upload.single("file"),
  async (req, res) => {
    try {
      const { authorComment } = req.body;
      if (!req.file) return res.status(400).json({ error: "Файл не обрано" });

      const project = await Project.findById(req.params.id);
      if (!project)
        return res.status(404).json({ error: "Проєкт не знайдено" });

      const isAuthor = project.authorId.toString() === req.user.id;
      const isPrivileged =
        req.user.role === "admin" || req.user.role === "superadmin";

      if (!isAuthor && !isPrivileged) {
        return res
          .status(403)
          .json({ error: "Ви не можете редагувати чужий проєкт" });
      }

      const newVersion = {
        fileUrl: req.file.path,
        fileName: req.file.originalname,
        authorComment: authorComment || "Виправлена версія",
        createdAt: new Date(),
      };

      project.versions.push(newVersion);
      project.fileUrl = req.file.path; // ТУТ ТАКОЖ .path
      project.status = "На розгляді";
      project.reviewStatus = "В процесі";

      await project.save();
      res.json({ message: "Нову версію успішно додано!", project });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
);

router.patch(
  "/assign/:id",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  async (req, res) => {
    try {
      const { reviewerId } = req.body;
      const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        { reviewerId, reviewStatus: "В процесі" },
        { new: true },
      );
      if (!updatedProject)
        return res.status(404).json({ error: "Проєкт не знайдено" });
      res.json(updatedProject);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
);

router.get("/reviewer/:reviewerId", verifyToken, async (req, res) => {
  try {
    const { reviewerId } = req.params;

    const currentUserId = req.user.id || req.user._id;

    const isPrivileged =
      req.user.role === "admin" || req.user.role === "superadmin";

    if (currentUserId.toString() !== reviewerId.toString() && !isPrivileged) {
      return res.status(403).json({
        error:
          "Доступ заборонено: ви не можете переглядати чужу чергу рецензування",
      });
    }

    const projects = await Project.find({
      reviewerId: new mongoose.Types.ObjectId(reviewerId),
    })
      .populate("authorId", "name email")
      .populate("programId", "title")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error("Помилка на маршруті /reviewer/:id :", err);

    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ error: "Некоректний формат ID рецензента" });
    }

    res
      .status(500)
      .json({ error: "Внутрішня помилка сервера: " + err.message });
  }
});

router.patch(
  "/submit-review/:id",
  verifyToken,
  checkRole(["reviewer", "admin", "superadmin"]),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project)
        return res.status(404).json({ error: "Проєкт не знайдено" });

      const isAssignedReviewer =
        project.reviewerId && project.reviewerId.toString() === req.user.id;
      const isPrivileged =
        req.user.role === "admin" || req.user.role === "superadmin";

      if (!isAssignedReviewer && !isPrivileged) {
        return res
          .status(403)
          .json({ error: "Ви не є рецензентом цього проєкту" });
      }

      const { reviewNotes, reviewerComments, status } = req.body;
      const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        {
          reviewNotes,
          reviewerComments,
          reviewStatus: "Завершено",
          status,
        },
        { new: true },
      );
      res.json(updatedProject);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
);

router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const isPrivileged =
      req.user.role === "admin" || req.user.role === "superadmin";
    if (req.user.id !== req.params.userId && !isPrivileged) {
      return res
        .status(403)
        .json({ error: "Ви не можете переглядати чужі проєкти" });
    }

    const projects = await Project.find({
      authorId: req.params.userId,
    }).populate("programId", "title");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get(
  "/all",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  async (req, res) => {
    try {
      const projects = await Project.find()
        .populate("authorId", "name email")
        .populate("programId", "title")
        .populate("reviewerId", "name")
        .sort({ createdAt: -1 });
      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

router.get("/archive", async (req, res) => {
  try {
    const archivedProjects = await Project.find({ status: "Прийнято" })
      .populate("authorId", "name image bio")
      .populate("programId", "title")
      .sort({ createdAt: -1 });

    res.json(archivedProjects);
  } catch (err) {
    console.error("Помилка при отриманні архіву:", err);
    res.status(500).json({ error: "Не вдалося завантажити архів статей" });
  }
});

router.get(
  "/",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  async (req, res) => {
    try {
      const projects = await Project.find()
        .populate("authorId", "name email")
        .populate("programId", "title")
        .sort({ createdAt: -1 });
      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

router.patch(
  "/status/:id",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  async (req, res) => {
    try {
      const { status } = req.body;
      const { id } = req.params;

      // Валідація статусу (опціонально, але бажано)
      const allowedStatuses = [
        "На розгляді",
        "Затверджено",
        "Відхилено",
        "Очікує",
      ];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: "Неприпустимий статус проекту" });
      }

      const project = await Project.findByIdAndUpdate(
        id,
        { status },
        { new: true }, // Повертає оновлений документ
      );

      if (!project) {
        return res.status(404).json({ error: "Проект не знайдено" });
      }

      res.json({ message: "Статус успішно оновлено", project });
    } catch (err) {
      res.status(500).json({ error: "Помилка при оновленні статусу" });
    }
  },
);

module.exports = router;

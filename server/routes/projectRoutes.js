const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const User = require("../models/User");
const { Program } = require("../models/Program");
const upload = require("../middleware/upload");
const mongoose = require("mongoose");
const { verifyToken, checkRole } = require("../middleware/auth");

const getOrganizationMemberIds = async (adminId) => {
  const adminUser = await User.findById(adminId);
  if (!adminUser || !adminUser.organizationId) return [];

  const members = await User.find({
    organizationId: adminUser.organizationId,
  }).select("_id");
  return members.map((m) => m._id);
};

// ==========================================
// 1. БЛОК СТВОРЕННЯ ТА ОНОВЛЕННЯ (Користувачі — повністю відкрита подача)
// ==========================================

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
      const isSuperAdmin = req.user.role === "superadmin";

      if (!isAuthor && !isSuperAdmin) {
        return res
          .status(403)
          .json({ error: "Ви не можете редагувати цей проєкт" });
      }

      const newVersion = {
        fileUrl: req.file.path,
        fileName: req.file.originalname,
        authorComment: authorComment || "Виправлена версія",
        createdAt: new Date(),
      };

      project.versions.push(newVersion);
      project.fileUrl = req.file.path;
      project.status = "На розгляді";
      project.reviewStatus = "В процесі";

      await project.save();
      res.json({ message: "Нову версію успішно додано!", project });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
);

// ==========================================
// 2. БЛОК РЕЦЕНЗУВАННЯ ТА ПРИЗНАЧЕННЯ (З анти-кумівством та сортуванням)
// ==========================================

router.patch(
  "/assign/:id",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  async (req, res) => {
    try {
      const { reviewerId } = req.body;
      const projectId = req.params.id;

      const project = await Project.findById(projectId);
      if (!project)
        return res.status(404).json({ error: "Проєкт не знайдено" });

      const author = await User.findById(project.authorId);
      const reviewer = await User.findById(reviewerId);

      if (
        author &&
        reviewer &&
        author.organizationId &&
        reviewer.organizationId &&
        author.organizationId.toString() === reviewer.organizationId.toString()
      ) {
        return res.status(400).json({
          error:
            "Конфлікт інтересів: Рецензент та автор належать до однієї організації!",
        });
      }

      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { reviewerId, reviewStatus: "В процесі" },
        { new: true },
      );

      res.json(updatedProject);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
);

router.get("/reviewer/:reviewerId", verifyToken, async (req, res) => {
  try {
    const { reviewerId } = req.params;
    const { programType } = req.query;
    const currentUserId = req.user.id;

    let isAuthorized =
      currentUserId.toString() === reviewerId.toString() ||
      req.user.role === "superadmin";
    if (!isAuthorized && req.user.role === "admin") {
      const adminUser = await User.findById(currentUserId);
      const reviewerUser = await User.findById(reviewerId);
      if (
        adminUser.organizationId &&
        reviewerUser?.organizationId &&
        adminUser.organizationId.toString() ===
          reviewerUser.organizationId.toString()
      ) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({ error: "Доступ заборонено до цієї черги" });
    }

    let query = { reviewerId: new mongoose.Types.ObjectId(reviewerId) };

    let projects = await Project.find(query)
      .populate("authorId", "name email organizationId")
      .populate("programId")
      .sort({ createdAt: -1 });

    const reviewerUser = await User.findById(reviewerId);

    projects = projects.filter((project) => {
      if (!project.authorId || !reviewerUser) return true;

      const authorOrg = project.authorId.organizationId;
      const reviewerOrg = reviewerUser.organizationId;

      if (
        authorOrg &&
        reviewerOrg &&
        authorOrg.toString() === reviewerOrg.toString()
      ) {
        return false;
      }
      return true;
    });

    if (programType) {
      projects = projects.filter(
        (project) =>
          project.programId && project.programId.type === programType,
      );
    }

    res.json(projects);
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).json({ error: "Некоректний формат ID" });
    res.status(500).json({ error: err.message });
  }
});

router.patch(
  "/submit-review/:id",
  verifyToken,
  checkRole(["reviewer", "admin", "superadmin"]),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id).populate(
        "authorId",
        "organizationId",
      );

      if (!project)
        return res.status(404).json({ error: "Проєкт не знайдено" });

      // Перевірка, чи це призначений рецензент
      const isAssignedReviewer =
        project.reviewerId && project.reviewerId.toString() === req.user.id;
      if (!isAssignedReviewer && req.user.role !== "superadmin") {
        return res
          .status(403)
          .json({ error: "Ви не є призначеним рецензентом цього проєкту" });
      }

      const reviewerUser = await User.findById(req.user.id);
      if (
        project.authorId?.organizationId &&
        reviewerUser?.organizationId &&
        project.authorId.organizationId.toString() ===
          reviewerUser.organizationId.toString()
      ) {
        return res.status(403).json({
          error:
            "Заборонено: Ви не можете оцінювати роботу члена своєї організації!",
        });
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

// ==========================================
// 3. БЛОК ОТРИМАННЯ ТА СТАТИСТИКИ (Кабінети організацій)
// ==========================================

router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    let isAuthorized =
      req.user.id === req.params.userId || req.user.role === "superadmin";

    if (!isAuthorized && req.user.role === "admin") {
      const memberIds = await getOrganizationMemberIds(req.user.id);
      isAuthorized = memberIds.some(
        (id) => id.toString() === req.params.userId,
      );
    }

    if (!isAuthorized) {
      return res
        .status(403)
        .json({ error: "Ви не маєте доступу до цієї статистики" });
    }

    const projects = await Project.find({
      authorId: req.params.userId,
    }).populate("programId", "title type");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const fetchAdminProjects = async (req, res) => {
  try {
    if (req.user.role === "superadmin") {
      const projects = await Project.find()
        .populate("authorId", "name email")
        .populate("programId", "title type")
        .populate("reviewerId", "name")
        .sort({ createdAt: -1 });
      return res.json(projects);
    }

    if (req.user.role === "admin") {
      const memberIds = await getOrganizationMemberIds(req.user.id);

      const projects = await Project.find({ authorId: { $in: memberIds } })
        .populate("authorId", "name email")
        .populate("programId", "title type")
        .populate("reviewerId", "name")
        .sort({ createdAt: -1 });
      return res.json(projects);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

router.get(
  "/all",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  fetchAdminProjects,
);
router.get(
  "/",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  fetchAdminProjects,
);

router.get("/archive", async (req, res) => {
  try {
    const projects = await Project.find({ status: "Прийнято" })
      .populate({
        path: "programId",
        select: "title type issn impactFactor organizer location externalLink",
      })
      .populate("authorId", "name email")
      .sort({ createdAt: -1 });

    const publicArchive = projects.filter((project) => {
      const programType = project.programId?.type;
      return programType === "Науковий журнал" || programType === "Конференція";
    });

    res.json(publicArchive);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. МОДЕРАЦІЯ СТАТУСІВ (Суперадмін або право виправлення)
// ==========================================
router.patch(
  "/status/:id",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  async (req, res) => {
    try {
      const { status } = req.body;
      const { id } = req.params;

      if (!status) return res.status(400).json({ error: "Статус не надано" });

      const allowedStatuses = [
        "на розгляді",
        "прийнято",
        "на доопрацюванні",
        "відхилено",
      ];
      const normalizedStatus = status.trim().toLowerCase();

      if (!allowedStatuses.includes(normalizedStatus)) {
        return res.status(400).json({ error: "Неприпустимий статус проекту" });
      }

      if (req.user.role === "admin") {
        const checkProject = await Project.findById(id);
        if (!checkProject)
          return res.status(404).json({ error: "Проект не знайдено" });

        const memberIds = await getOrganizationMemberIds(req.user.id);
        const isOurMember = memberIds.some(
          (mId) => mId.toString() === checkProject.authorId.toString(),
        );
        if (!isOurMember) {
          return res.status(403).json({
            error:
              "Ви можете керувати статусом робіт тільки для моніторингу членів своєї організації",
          });
        }
      }

      const project = await Project.findByIdAndUpdate(
        id,
        { status: status.trim() },
        { returnDocument: "after", runValidators: true },
      );

      res.json({ message: "Статус успішно оновлено", project });
    } catch (err) {
      res.status(500).json({ error: "Помилка при оновленні статусу" });
    }
  },
);

module.exports = router;

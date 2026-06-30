const express = require("express");
const router = express.Router();
const {
  Program,
  JournalProgram,
  GrantProgram,
  ConferenceProgram,
  DatasetProgram,
  CourseProgram,
} = require("../models/Program");
const User = require("../models/User");
const jwt = require("jsonwebtoken"); // 🟢 Переконайся, що бібліотеку імпортовано для ручної розшифровки публічного роуту
const { verifyToken, checkRole } = require("../middleware/auth");

// =========================================================================
// 📄 ОТРИМАННЯ ПРОГРАМ (Глобальний пошук та ізоляція для кабінетів організацій)
// =========================================================================
router.get("/", async (req, res) => {
  try {
    let query = { active: true };

    // 1. Якщо фронтенд явно передав параметр orgId (наприклад, суперадмін зайшов у кабінет)
    if (req.query.orgId) {
      query.organizationId = req.query.orgId;
    }
    // 2. Якщо запит робить залогінений адмін організації і він переглядає свій кабінет
    else if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "secret_key",
        );

        if (decoded && decoded.role === "admin") {
          // Беремо актуальний орг-айді прямо з бази, щоб захиститися від старих токенів
          const freshUser = await User.findById(decoded.id).select(
            "organizationId",
          );
          if (freshUser && freshUser.organizationId) {
            query.organizationId = freshUser.organizationId;
          } else {
            return res.json([]); // Адмін без організації не бачить нічого
          }
        }
      } catch (e) {
        // Якщо токен невалідний або це публічний гість із головної сторінки сайту — просто ігноруємо
      }
    }

    const programs = await Program.find(query)
      .populate("organizationId", "name logo")
      .sort({ deadline: 1 });

    res.json(programs);
  } catch (err) {
    console.error("Get Programs Error:", err);
    res.status(500).json({ error: "Помилка при отриманні програм" });
  }
});

// Отримання архівних програм
router.get(
  "/archive",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  async (req, res) => {
    try {
      let query = { active: false };

      // 1. Якщо суперадмін переглядає архів конкретної організації
      if (req.query.orgId) {
        query.organizationId = req.query.orgId;
      }
      // 2. Якщо це звичайний локальний адмін організації
      else if (req.user.role === "admin") {
        const adminUser = await User.findById(req.user.id).select(
          "organizationId",
        );
        if (!adminUser || !adminUser.organizationId) {
          return res.json([]);
        }
        query.organizationId = adminUser.organizationId;
      }

      const archived = await Program.find(query)
        .populate("organizationId", "name logo")
        .sort({ updatedAt: -1 });

      res.json(archived);
    } catch (err) {
      console.error("Get Archive Programs Error:", err);
      res.status(500).json({ error: "Помилка при отриманні архіву" });
    }
  },
);

// =========================================================================
// 🟢 СТВОРЕННЯ ПРОГРАМИ (Гнучке автоматичне призначення організації)
// =========================================================================
router.post(
  "/",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  async (req, res) => {
    try {
      const {
        title,
        description,
        deadline,
        domain,
        type,
        amount,
        organizer,
        issn,
        impactFactor,
        externalLink,
        location,
        orgId, // Може прийти від суперадміна, якщо він діє всередині кабінету філії
      } = req.body;

      if (!title || !description || !deadline || !type) {
        return res.status(400).json({
          error: "Будь ласка, заповніть усі обов'язкові поля, включаючи тип",
        });
      }

      const freshUser = await User.findById(req.user.id).select(
        "organizationId",
      );
      if (!freshUser)
        return res.status(404).json({ error: "Адміністратора не знайдено" });

      let assignedOrgId = null;

      if (req.user.role === "admin") {
        if (!freshUser.organizationId) {
          return res.status(403).json({
            error:
              "Ваш профіль не прив'язано до жодної організації. Створення заборонено.",
          });
        }
        assignedOrgId = freshUser.organizationId;
      } else if (req.user.role === "superadmin") {
        assignedOrgId = orgId || null;
      }

      const baseData = {
        title,
        description,
        deadline,
        domain,
        createdBy: req.user.id,
        organizationId: assignedOrgId,
        active: true,
      };

      let newProgram;

      switch (type) {
        case "Науковий журнал":
          if (!issn)
            return res
              .status(400)
              .json({ error: "Для журналу обов'язково вказати ISSN" });
          newProgram = new JournalProgram({
            ...baseData,
            issn,
            impactFactor:
              impactFactor && impactFactor !== "" ? Number(impactFactor) : 0,
          });
          break;

        case "Грант":
          if (!amount || !organizer) {
            return res.status(400).json({
              error: "Для гранту обов'язково вказати суму та організатора",
            });
          }
          newProgram = new GrantProgram({ ...baseData, amount, organizer });
          break;

        case "Конференція":
          if (!organizer)
            return res.status(400).json({
              error: "Для конференції обов'язково вказати організатора",
            });
          newProgram = new ConferenceProgram({
            ...baseData,
            organizer,
            externalLink,
            location: location || "Онлайн",
          });
          break;

        case "Датасет":
          newProgram = new DatasetProgram({ ...baseData, externalLink });
          break;

        case "Курс":
          newProgram = new CourseProgram({ ...baseData, externalLink });
          break;

        default:
          newProgram = new Program({ ...baseData, type });
      }

      const savedProgram = await newProgram.save();
      res.status(201).json(savedProgram);
    } catch (err) {
      console.error("Помилка створення програми:", err);
      res.status(500).json({ error: "Помилка сервера при створенні програми" });
    }
  },
);

// =========================================================================
// ✏️ РЕДАГУВАННЯ ТА КЕРУВАННЯ (З перевіркою належності до однієї організації)
// =========================================================================
router.put(
  "/:id",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  async (req, res) => {
    try {
      const {
        title,
        shortDescription,
        description,
        deadline,
        domain,
        type,
        amount,
        organizer,
        issn,
        impactFactor,
        externalLink,
        location,
      } = req.body;

      let program = await Program.findById(req.params.id);
      if (!program) {
        return res.status(404).json({ error: "Програму не знайдено" });
      }

      // Перевірка організації для звичайного локального адміна
      if (req.user.role === "admin") {
        const freshUser = await User.findById(req.user.id).select(
          "organizationId",
        );
        if (
          !freshUser ||
          !program.organizationId ||
          program.organizationId.toString() !==
            freshUser.organizationId.toString()
        ) {
          return res.status(403).json({
            error: "Ви можете редагувати тільки програми вашої організації",
          });
        }
      }

      program.title = title || program.title;
      program.shortDescription =
        shortDescription !== undefined
          ? shortDescription
          : program.shortDescription;
      program.description = description || program.description;
      program.deadline = deadline || program.deadline;
      program.domain = domain || program.domain;

      if (type === "Науковий журнал") {
        program.issn = issn;
        program.impactFactor =
          impactFactor && impactFactor !== "" ? Number(impactFactor) : 0;
        program.amount = undefined;
        program.organizer = undefined;
      } else if (type === "Грант") {
        program.amount = amount;
        program.organizer = organizer;
        program.issn = undefined;
        program.impactFactor = undefined;
      } else if (type === "Конференція") {
        program.organizer = organizer;
        program.externalLink = externalLink;
        program.location = location || "Онлайн";
        program.issn = undefined;
        program.amount = undefined;
      } else {
        program.externalLink = externalLink;
      }

      const updatedProgram = await program.save();
      res.json(updatedProgram);
    } catch (err) {
      console.error("Помилка при оновленні програми:", err);
      res.status(500).json({ error: "Помилка сервера при оновленні програми" });
    }
  },
);

router.patch(
  "/:id/toggle-status",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  async (req, res) => {
    try {
      const program = await Program.findById(req.params.id);
      if (!program)
        return res.status(404).json({ error: "Програму не знайдено" });

      // Перевірка організації для зміни статусу
      if (req.user.role === "admin") {
        const freshUser = await User.findById(req.user.id).select(
          "organizationId",
        );
        if (
          !freshUser ||
          !program.organizationId ||
          program.organizationId.toString() !==
            freshUser.organizationId.toString()
        ) {
          return res.status(403).json({
            error:
              "У вас немає права змінювати статус програм інших організацій",
          });
        }
      }

      program.active = !program.active;
      await program.save();
      res.json({
        message: `Статус змінено на ${program.active ? "Активний" : "Архівний"}`,
        program,
      });
    } catch (err) {
      res.status(500).json({ error: "Помилка при зміні статусу" });
    }
  },
);

router.delete(
  "/:id/permanent",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  async (req, res) => {
    try {
      const program = await Program.findById(req.params.id);
      if (!program)
        return res.status(404).json({ error: "Програму не знайдено" });

      // Перевірка організації для безповоротного видалення
      if (req.user.role === "admin") {
        const freshUser = await User.findById(req.user.id).select(
          "organizationId",
        );
        if (
          !freshUser ||
          !program.organizationId ||
          program.organizationId.toString() !==
            freshUser.organizationId.toString()
        ) {
          return res.status(403).json({
            error: "Ви не можете видалити програму іншої організації",
          });
        }
      }

      await Program.findByIdAndDelete(req.params.id);
      res.json({ message: "Програму видалено назавжди" });
    } catch (err) {
      res.status(500).json({ error: "Помилка при повному видаленні" });
    }
  },
);

router.get("/:id", async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).populate(
      "organizationId",
      "name logo description website",
    );
    if (!program)
      return res.status(404).json({ error: "Програму не знайдено" });
    res.json(program);
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(400).json({ error: "Некоректний формат ID" });
    res.status(500).json({ error: "Помилка сервера" });
  }
});

module.exports = router;

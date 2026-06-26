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
const { verifyToken, checkRole } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const programs = await Program.find({ active: true }).sort({ deadline: 1 });
    res.json(programs);
  } catch (err) {
    res.status(500).json({ error: "Помилка при отриманні програм" });
  }
});

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
      } = req.body;

      if (!title || !description || !deadline || !type) {
        return res.status(400).json({
          error: "Будь ласка, заповніть усі обов'язкові поля, включаючи тип",
        });
      }

      const baseData = {
        title,
        description,
        deadline,
        domain,
        createdBy: req.user.id,
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
          newProgram = new GrantProgram({
            ...baseData,
            amount,
            organizer,
          });
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

router.get(
  "/archive",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  async (req, res) => {
    try {
      const archived = await Program.find({ active: false }).sort({
        updatedAt: -1,
      });
      res.json(archived);
    } catch (err) {
      res.status(500).json({ error: "Помилка при отриманні архіву" });
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
      const deletedProgram = await Program.findByIdAndDelete(req.params.id);
      if (!deletedProgram)
        return res.status(404).json({ error: "Програму не знайдено" });
      res.json({ message: "Програму видалено назавжди" });
    } catch (err) {
      res.status(500).json({ error: "Помилка при повному видаленні" });
    }
  },
);

router.get("/:id", async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
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

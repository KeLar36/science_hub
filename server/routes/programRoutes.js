const express = require("express");
const router = express.Router();
const Program = require("../models/Program");
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
      const { title, description, deadline, domain, type } = req.body;

      if (!title || !description || !deadline) {
        return res
          .status(400)
          .json({ error: "Будь ласка, заповніть усі обов'язкові поля" });
      }

      const newProgram = new Program({
        title,
        description,
        deadline,
        domain,
        type,
        adminId: req.user.id,
        active: true,
      });

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

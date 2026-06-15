const express = require("express");
const router = express.Router();
const User = require("../models/UserTemp");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const { verifyToken, checkRole } = require("../middleware/auth");

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, city, topics, bio } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Будь ласка, заповніть усі обов'язкові поля" });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists)
      return res.status(400).json({ error: "Цей Email вже зареєстровано" });

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      city: city || "",
      topics: Array.isArray(topics) ? topics : [],
      bio: bio || "",
      role: "user",
      socials: {
        github: "",
        twitter: "",
        linkedIn: "",
      },
    });

    await user.save();
    res.status(201).json({ message: "Користувача успішно створено!" });
  } catch (err) {
    console.error("DETAILED ERROR:", err);

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.isBanned) {
      return res
        .status(400)
        .json({ error: "Доступ неможливий або акаунт заблоковано" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Невірний пароль" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Користувача не знайдено" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${frontendUrl}/reset-password/${token}`;
    const mailOptions = {
      to: user.email,
      from: "Science Platform <no-reply@science.edu>",
      subject: "Відновлення пароля",
      text: `Ви отримали цей лист, тому що ви (або хтось інший) попросили скинути пароль.\n\n
              Будь ласка, натисніть на посилання або вставте його в браузер: \n\n
              ${resetUrl} \n\n
              Якщо ви цього не робили, ігноруйте цей лист.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Лист для відновлення надіслано!" });
  } catch (err) {
    res.status(500).json({ error: "Помилка при відправці пошти" });
  }
});

router.get("/bookmarks/check/:id", verifyToken, async (req, res) => {
  try {
    // Оскільки в jwt.sign було { id: user._id }, то req.user.id працюватиме супер
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ error: "Користувача не знайдено" });

    const isBookmarked = user.bookmarks
      ? user.bookmarks.includes(req.params.id)
      : false;
    res.json({ isBookmarked });
  } catch (err) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Токен недійсний або його термін дії вичерпано" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Пароль успішно змінено!" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ error: "Помилка на сервері при зміні пароля" });
  }
});

module.exports = router;

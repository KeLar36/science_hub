const express = require("express");
const router = express.Router();
const User = require("../models/UserTemp");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

const auth = (req, res, next) => {
  const token =
    req.header("x-auth-token") ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Авторизація відхилена" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Токен недійсний" });
  }
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: "Email вже зайнято" });

    const user = new User({
      name,
      email,
      password,
      role: role || "user",
      bookmarks: [],
    });

    await user.save();
    res.status(201).json({ message: "Успішно!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.isBanned) {
      return res.status(400).json({ error: "Доступ неможливий" });
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
      user: { id: user._id, name: user.name, role: user.role },
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
      text: `Посилання для скидання пароля: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Лист надіслано!" });
  } catch (err) {
    res.status(500).json({ error: "Помилка при відправці пошти" });
  }
});

router.get("/bookmarks/check/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const isBookmarked = user.bookmarks
      ? user.bookmarks.includes(req.params.id)
      : false;
    res.json({ isBookmarked });
  } catch (err) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

module.exports = router;

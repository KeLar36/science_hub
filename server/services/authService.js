const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to,
    from: "Science Platform <no-reply@science.edu>",
    subject,
    text,
  });
};

class AuthService {
  async register(userData) {
    const { name, email, password, city, topics, bio } = userData;
    const sanitizedEmail = email.trim().toLowerCase();

    const userExists = await User.findOne({ email: sanitizedEmail });
    if (userExists) {
      const error = new Error("Цей Email вже зареєстровано");
      error.statusCode = 400;
      throw error;
    }

    const user = new User({
      name: name.trim(),
      email: sanitizedEmail,
      password,
      city: city || "",
      topics: Array.isArray(topics) ? topics : [],
      bio: bio || "",
      role: "user",
    });

    return await user.save();
  }

  async login(email, password) {
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || user.isBanned) {
      const error = new Error("Доступ неможливий або акаунт заблоковано");
      error.statusCode = 400;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error("Невірний пароль");
      error.statusCode = 400;
      throw error;
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "30d",
    });

    return { token, user: { id: user._id, name: user.name, role: user.role } };
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      const error = new Error("Користувача не знайдено");
      error.statusCode = 404;
      throw error;
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 година
    await user.save();

    const resetUrl = `${frontendUrl}/reset-password/${token}`;
    const mailText = `Ви отримали цей лист, тому що ви попросили скинути пароль.\n\nБудь ласка, натисніть на посилання: \n\n${resetUrl}\n\nЯкщо ви цього не робили, ігноруйте цей лист.`;

    await sendEmail(user.email, "Відновлення пароля", mailText);
  }

  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error("Токен недійсний або його термін дії вичерпано");
      error.statusCode = 400;
      throw error;
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }
}

module.exports = new AuthService();

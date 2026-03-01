const express = require('express');
const router = express.Router();
const User = require('../models/UserTemp');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ error: "Email вже зайнято" });

        const user = new User({
            name,
            email,
            password,
            role: role || 'user'
        });

        await user.save();
        res.status(201).json({ message: "Успішно!" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
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

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: "Помилка сервера" });
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "Користувача з таким Email не знайдено" });
        }

        const token = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const resetUrl = `${frontendUrl}/reset-password/${token}`;
        const mailOptions = {
            to: user.email,
            from: 'Science Platform <no-reply@science.edu>',
            subject: 'Відновлення пароля',
            text: `Ви отримали цей лист, тому що ви (або хтось інший) попросили скинути пароль для вашого акаунту.\n\n` +
                `Будь ласка, натисніть на посилання або вставте його в браузер, щоб завершити процес:\n\n` +
                `${resetUrl}\n\n` +
                `Якщо ви цього не робили, просто ігноруйте цей лист.\n`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Лист надіслано!" });

    } catch (err) {
        res.status(500).json({ error: "Помилка при відправці пошти" });
    }
});

router.post('/reset-password/:token', async (req, res) => {
    try {
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: "Токен недійсний або його термін дії вичерпано" });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        res.json({ message: "Пароль успішно змінено!" });

    } catch (err) {
        res.status(500).json({ error: "Помилка сервера" });
    }
});

module.exports = router;
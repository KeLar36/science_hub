const express = require('express');
const router = express.Router();
const User = require('../models/UserTemp');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

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

module.exports = router;
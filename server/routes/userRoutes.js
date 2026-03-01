const express = require('express');
const router = express.Router();
const User = require('../models/UserTemp');

router.get('/all', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/role/:id', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { returnDocument: 'after' }
    );
    if (!user) return res.status(404).json({ message: "Користувача не знайдено" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/ban/:id', async (req, res) => {
  try {
    const { isBanned } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned },
      { returnDocument: 'after' }
    );
    if (!user) return res.status(404).json({ message: "Користувача не знайдено" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Користувача видалено" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const User = require("../models/UserTemp");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

const auth = (req, res, next) => {
  const token =
    req.header("x-auth-token") ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ error: "Авторизація відхилена: немає токена" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Токен недійсний" });
  }
};

router.get("/all", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/role/:id", async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { returnDocument: "after" },
    );
    if (!user)
      return res.status(404).json({ message: "Користувача не знайдено" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/ban/:id", async (req, res) => {
  try {
    const { isBanned } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned },
      { returnDocument: "after" },
    );
    if (!user)
      return res.status(404).json({ message: "Користувача не знайдено" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Користувача видалено" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/bookmarks/check/:id", auth, async (req, res) => {
  try {
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

router.post("/bookmarks/toggle/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ error: "Користувача не знайдено" });

    const postId = req.params.id;
    if (!user.bookmarks) user.bookmarks = [];

    const index = user.bookmarks.indexOf(postId);
    if (index === -1) {
      user.bookmarks.push(postId);
    } else {
      user.bookmarks.splice(index, 1);
    }

    await user.save();
    res.json({
      isBookmarked: index === -1,
      message: index === -1 ? "Додано до закладок" : "Видалено з закладок",
    });
  } catch (err) {
    res.status(500).json({ error: "Помилка при зміні стану закладок" });
  }
});

router.get("/bookmarks/all", auth, async (req, res) => {
  try {
    const Post = require("../models/Post");
    const user = await User.findById(req.user.id);

    const bookmarkedPosts = await Post.find({
      _id: { $in: user.bookmarks },
    }).sort({ createdAt: -1 });

    res.json(bookmarkedPosts);
  } catch (err) {
    res.status(500).json({ error: "Помилка при отриманні закладок" });
  }
});

router.post("/bookmark/:postId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const postId = req.params.postId;

    if (!user)
      return res.status(404).json({ message: "Користувача не знайдено" });

    const isBookmarked = user.bookmarks.includes(postId);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== postId);
      await user.save();
      return res.json({
        message: "Пост видалено з закладок",
        bookmarks: user.bookmarks,
      });
    } else {
      user.bookmarks.push(postId);
      await user.save();
      return res.json({
        message: "Пост додано до закладок",
        bookmarks: user.bookmarks,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

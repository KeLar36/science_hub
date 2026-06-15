const express = require("express");
const router = express.Router();
const User = require("../models/UserTemp");
const Post = require("../models/Post");

const { verifyToken, checkRole } = require("../middleware/auth");

const adminAccess = checkRole(["admin", "superadmin"]);

router.get("/all", verifyToken, adminAccess, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/role/:id", verifyToken, adminAccess, async (req, res) => {
  try {
    const { role } = req.body;

    // req.user.id comes from jwt.sign({ id: user._id, role: ... })
    if (req.params.id === req.user.id)
      return res.status(400).json({ message: "Не можна змінити власну роль" });

    const targetUser = await User.findById(req.params.id);
    if (!targetUser)
      return res.status(404).json({ message: "Користувача не знайдено" });

    if (role === "superadmin" && req.user.role !== "superadmin")
      return res
        .status(403)
        .json({ message: "Тільки суперадмін може призначати цю роль" });

    if (targetUser.role === "superadmin" && req.user.role !== "superadmin")
      return res
        .status(403)
        .json({ message: "Ви не можете змінити роль суперадміна" });

    if (targetUser.role === "admin" && req.user.role !== "superadmin")
      return res.status(403).json({
        message: "Тільки суперадмін може змінювати роль адміністратора",
      });

    targetUser.role = role;
    await targetUser.save();
    res.json(targetUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/ban/:id", verifyToken, adminAccess, async (req, res) => {
  try {
    const { isBanned } = req.body;

    if (req.params.id === req.user.id)
      return res
        .status(400)
        .json({ message: "Не можна заблокувати самого себе" });

    const targetUser = await User.findById(req.params.id);
    if (!targetUser)
      return res.status(404).json({ message: "Користувача не знайдено" });

    const isSuper = req.user.role === "superadmin";
    const targetIsStaff =
      targetUser.role === "admin" || targetUser.role === "superadmin";

    if (!isSuper && targetIsStaff)
      return res
        .status(403)
        .json({ message: "Ви не можете забанити адміністратора" });

    targetUser.isBanned = isBanned;
    await targetUser.save();
    res.json(targetUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", verifyToken, adminAccess, async (req, res) => {
  try {
    if (req.params.id === req.user.id)
      return res
        .status(400)
        .json({ message: "Не можна видалити власний акаунт" });

    const targetUser = await User.findById(req.params.id);
    if (!targetUser)
      return res.status(404).json({ message: "Користувача не знайдено" });

    if (
      (targetUser.role === "admin" || targetUser.role === "superadmin") &&
      req.user.role !== "superadmin"
    ) {
      return res
        .status(403)
        .json({ message: "Тільки суперадмін може видаляти персонал" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Користувача видалено" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/count", verifyToken, async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/bookmarks/check/:id", verifyToken, async (req, res) => {
  try {
    // req.user.id — matches jwt.sign({ id: user._id })
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Користувача не знайдено" });

    const isBookmarked = user.bookmarks
      ? user.bookmarks.includes(req.params.id)
      : false;
    res.json({ isBookmarked });
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера" });
  }
});

router.post("/bookmarks/toggle/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Користувача не знайдено" });

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
    res.status(500).json({ message: "Помилка закладок" });
  }
});

router.get("/bookmarks/all", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Користувача не знайдено" });

    const bookmarkedPosts = await Post.find({
      _id: { $in: user.bookmarks },
    }).sort({ createdAt: -1 });

    res.json(bookmarkedPosts);
  } catch (err) {
    res.status(500).json({ message: "Помилка при отриманні закладок" });
  }
});

router.get("/community", async (req, res) => {
  try {
    const users = await User.find(
      { isBanned: false },
      "name role image bio topics city socials status createdAt",
    ).sort({ status: 1, createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Помилка при отриманні списку спільноти" });
  }
});

// Отримання даних власного профілю
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Користувача не знайдено" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/update-profile", verifyToken, async (req, res) => {
  try {
    const { name, bio, topics, city, socials, image } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          name,
          bio,
          topics,
          city,
          socials,
          image,
        },
      },
      { new: true, runValidators: true },
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: "Не вдалося оновити профіль" });
  }
});

router.get("/", verifyToken, adminAccess, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

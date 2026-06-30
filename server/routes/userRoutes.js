const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");

const { verifyToken, checkRole, canManageUser } = require("../middleware/auth");
const adminAccess = checkRole(["admin", "superadmin"]);

// ==========================================
// 1. БЛОК ПОТОЧНОГО КОРИСТУВАЧА (МЕНЕ)
// ==========================================

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate({
      path: "bookmarks",
      model: "Post",
    });

    if (!user)
      return res.status(404).json({ message: "Користувача не знайдено" });

    res.json({ user });
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

// ==========================================
// 2. БЛОК ЗАКЛАДОК (Усі статичні під-шляхи)
// ==========================================

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

router.get("/bookmarks/check/:id", verifyToken, async (req, res) => {
  try {
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

router.get("/saved-posts", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "bookmarks",
      model: "Post",
    });

    if (!user) {
      return res.status(404).json({ message: "Користувача не знайдено" });
    }

    res.json(user.bookmarks || []);
  } catch (err) {
    console.error("Помилка завантаження збережених постів блогу:", err);
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

// ==========================================
// 3. БЛОК ЗАГАЛЬНОДОСТУПНИХ СТАТИЧНИХ РОУТІВ
// ==========================================

router.get("/community", async (req, res) => {
  try {
    const users = await User.find(
      { isBanned: false },
      "name role image bio topics city socials status organizationId createdAt",
    ).sort({ status: 1, createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Помилка при отриманні списку спільноти" });
  }
});

// ==========================================
// 4. АДМІНІСТРАТИВНІ РОУТИ (Збирають користувачів для кабінету організації)
// ==========================================

router.get("/all", verifyToken, adminAccess, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "admin") {
      const freshUser = await User.findById(req.user.id).select(
        "organizationId",
      );
      if (!freshUser || !freshUser.organizationId) {
        return res.json([]);
      }
      query.organizationId = freshUser.organizationId;
    } else if (req.user.role === "superadmin") {
      if (req.query.orgId) {
        query.organizationId = req.query.orgId;
      } else {
        query = {};
      }
    }

    const users = await User.find(query)
      .select("-password")
      .populate("organizationId", "name")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/count", verifyToken, adminAccess, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "admin") {
      const freshUser = await User.findById(req.user.id).select(
        "organizationId",
      );
      if (!freshUser || !freshUser.organizationId) {
        return res.json({ count: 0 });
      }
      query.organizationId = freshUser.organizationId;
    } else if (req.user.role === "superadmin") {
      if (req.query.orgId) {
        query.organizationId = req.query.orgId;
      } else {
        query = {};
      }
    }

    const count = await User.countDocuments(query);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", verifyToken, adminAccess, async (req, res) => {
  try {
    if (req.user.role === "superadmin") {
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });
      return res.json(users);
    }

    if (req.user.role === "admin") {
      const currentUser = await User.findById(req.user.id);
      if (!currentUser || !currentUser.organizationId) return res.json([]);

      const users = await User.find({
        organizationId: currentUser.organizationId,
      })
        .select("-password")
        .sort({ createdAt: -1 });
      return res.json(users);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch(
  "/role/:id",
  verifyToken,
  adminAccess,
  canManageUser,
  async (req, res) => {
    try {
      const { role } = req.body;

      if (req.params.id === req.user.id)
        return res
          .status(400)
          .json({ message: "Не можна змінити власну роль" });

      if (role === "superadmin" && req.user.role !== "superadmin") {
        return res.status(403).json({
          message: "Тільки суперадмін може призначати роль superadmin",
        });
      }

      const targetUser = await User.findById(req.params.id);
      if (!targetUser)
        return res.status(404).json({ message: "Користувача не знайдено" });

      targetUser.role = role;
      await targetUser.save();
      res.json(targetUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
);

router.patch(
  "/ban/:id",
  verifyToken,
  adminAccess,
  canManageUser,
  async (req, res) => {
    try {
      const { isBanned } = req.body;

      if (req.params.id === req.user.id)
        return res
          .status(400)
          .json({ message: "Не можна заблокувати самого себе" });

      const targetUser = await User.findByIdAndUpdate(
        req.params.id,
        { isBanned },
        { new: true },
      ).select("-password");

      res.json(targetUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
);

router.delete(
  "/:id",
  verifyToken,
  adminAccess,
  canManageUser,
  async (req, res) => {
    try {
      if (req.params.id === req.user.id)
        return res
          .status(400)
          .json({ message: "Не можна видалити власний акаунт" });

      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "Користувача успішно видалено" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

module.exports = router;

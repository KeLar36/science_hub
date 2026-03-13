const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/UserTemp");
const { verifyToken, checkRole } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category && category !== "Всі") {
      query.category = category;
    }
    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Помилка при отриманні постів" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Пост не знайдено" });
    res.json(post);
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({ message: "Некоректний ID" });
    res.status(500).json({ message: "Помилка сервера" });
  }
});

router.post(
  "/create",
  verifyToken,
  checkRole(["admin", "content-manager"]),
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, content, category, status } = req.body;
      const newPost = new Post({
        title,
        content,
        category,
        status: status || "published",
        authorId: req.user.id,
        coverImage: req.file ? req.file.location : null,
      });
      await newPost.save();
      res.status(201).json(newPost);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Не вдалося створити пост", error: err.message });
    }
  },
);

router.put(
  "/:id",
  verifyToken,
  checkRole(["admin", "content-manager"]),
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, content, category, status } = req.body;

      let updateData = {
        title,
        content,
        category,
        status,
      };

      if (req.file) {
        updateData.coverImage = req.file.location;
      }

      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true, runValidators: true },
      );

      if (!updatedPost)
        return res.status(404).json({ message: "Пост не знайдено" });

      res.json(updatedPost);
    } catch (err) {
      console.error("Update Error:", err);
      res.status(500).json({ message: "Помилка при оновленні поста" });
    }
  },
);

router.delete(
  "/:id",
  verifyToken,
  checkRole(["admin", "content-manager"]),
  async (req, res) => {
    try {
      const deletedPost = await Post.findByIdAndDelete(req.params.id);
      if (!deletedPost)
        return res.status(404).json({ message: "Пост не знайдено" });
      res.json({ message: "Пост успішно видалено" });
    } catch (err) {
      res.status(500).json({ message: "Помилка при видаленні" });
    }
  },
);

router.post("/:id/comment", verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Текст не може бути порожнім" });
    }

    const dbUser = await User.findById(req.user.id);
    if (!dbUser)
      return res.status(404).json({ message: "Користувача не знайдено" });

    const comment = {
      user: {
        id: dbUser._id,
        name: dbUser.name || dbUser.username || "Користувач",
      },
      text: text.trim(),
      createdAt: new Date(),
    };

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: comment } },
      { new: true },
    );

    if (!post) return res.status(404).json({ message: "Пост не знайдено" });

    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (err) {
    res.status(500).json({ message: "Помилка при додаванні коментаря" });
  }
});

router.delete("/:postId/comment/:commentId", verifyToken, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Пост не знайдено" });

    const comment = post.comments.id(commentId);
    if (!comment)
      return res.status(404).json({ message: "Коментар не знайдено" });

    if (
      comment.user.id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Немає прав" });
    }

    post.comments.pull(commentId);
    await post.save();
    res.json({ message: "Коментар видалено" });
  } catch (err) {
    res.status(500).json({ message: "Помилка сервера" });
  }
});

module.exports = router;

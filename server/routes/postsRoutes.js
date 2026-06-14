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
    const post = await Post.findById(req.params.id)
      .populate("authorId", "name role")
      .populate("comments.user", "name role");

    if (!post) return res.status(404).json({ message: "Пост не знайдено" });

    const types = ["fire", "heart", "clap", "idea"];
    if (!post.reactions) {
      post.reactions = { fire: [], heart: [], clap: [], idea: [] };
    } else {
      types.forEach((type) => {
        if (!Array.isArray(post.reactions[type])) {
          post.reactions[type] = [];
        }
      });
    }

    res.json(post);
  } catch (err) {
    console.error("Помилка при отриманні поста:", err);
    if (err.kind === "ObjectId")
      return res.status(404).json({ message: "Некоректний ID" });
    res.status(500).json({ message: "Помилка сервера" });
  }
});

router.post(
  "/create",
  verifyToken,
  checkRole(["admin", "content-manager", "superadmin"]),
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
        coverImage: req.file ? req.file.path : null,
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
  checkRole(["admin", "content-manager", "superadmin"]),
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, content, category, status } = req.body;
      let updateData = { title, content, category, status };

      if (req.file) {
        updateData.coverImage = req.file.path;
      }

      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true },
      ).populate("authorId", "name role");

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
  checkRole(["admin", "superadmin"]),
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

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            user: req.user.id,
            text: text.trim(),
          },
        },
      },
      { new: true },
    ).populate("comments.user", "name role");

    if (!post) return res.status(404).json({ message: "Пост не знайдено" });

    const newComment = post.comments[post.comments.length - 1];
    res.status(201).json(newComment);
  } catch (err) {
    console.error("Comment Error:", err);
    res.status(500).json({ message: "Помилка при додаванні коментаря" });
  }
});

router.delete("/:postId/comment/:commentId", verifyToken, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await Post.findById(postId).populate("comments.user", "role");

    if (!post) return res.status(404).json({ message: "Пост не знайдено" });

    const comment = post.comments.id(commentId);
    if (!comment)
      return res.status(404).json({ message: "Коментар не знайдено" });

    const currentUserRole = req.user.role;
    const currentUserId = req.user.id;
    const commentAuthorId = comment.user._id.toString();
    const commentAuthorRole = comment.user.role;

    const isOwner = commentAuthorId === currentUserId;
    const isSuper = currentUserRole === "superadmin";
    const isAdmin = currentUserRole === "admin";
    const isTargetHigherRole =
      commentAuthorRole === "admin" || commentAuthorRole === "superadmin";

    if (isOwner || isSuper || (isAdmin && !isTargetHigherRole)) {
      post.comments.pull(commentId);
      await post.save();
      return res.json({ message: "Коментар видалено" });
    }

    return res
      .status(403)
      .json({ message: "Недостатньо прав для видалення цього коментаря" });
  } catch (err) {
    console.error("Delete Comment Error:", err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

router.post("/:id/react", verifyToken, async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.user.id;
    const validReactions = ["fire", "heart", "clap", "idea"];

    if (!validReactions.includes(type)) {
      return res.status(400).json({ message: "Невалідний тип реакції" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Пост не знайдено" });

    if (!post.reactions) post.reactions = {};
    if (!post.reactions[type]) post.reactions[type] = [];

    const hasReacted = post.reactions[type].includes(userId);

    const update = hasReacted
      ? { $pull: { [`reactions.${type}`]: userId } }
      : { $addToSet: { [`reactions.${type}`]: userId } };

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    res.json({ reactions: updatedPost.reactions });
  } catch (err) {
    console.error("Reaction Error:", err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

module.exports = router;

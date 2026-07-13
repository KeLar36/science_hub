const postService = require("../services/postService");

class PostController {
  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;

      const result = await postService.getAll(req.query.category, page, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const post = await postService.getById(req.params.id);
      res.json(post);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { title, content, category, status } = req.body;
      if (!title || !content || !category) {
        return res.status(400).json({ error: "Заповніть обов'язкові поля" });
      }

      const filePath = req.file ? req.file.path : null;

      const postData = {
        title: title.trim(),
        content: content.trim(),
        category,
        status: status || "published",
      };

      const newPost = await postService.create(req.user.id, postData, filePath);
      res.status(201).json(newPost);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      let filePath = req.file ? req.file.path : null;

      if (!filePath && req.body.coverImage) {
        filePath = req.body.coverImage;
      }

      const updatedPost = await postService.update(
        req.params.id,
        req.body,
        filePath,
      );
      res.json(updatedPost);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await postService.delete(req.params.id);
      res.json({ message: "Пост успішно видалено" });
    } catch (err) {
      next(err);
    }
  }

  async addComment(req, res, next) {
    try {
      const { text } = req.body;
      if (!text || text.trim() === "") {
        return res.status(400).json({ error: "Текст не може бути порожнім" });
      }

      const newComment = await postService.addComment(
        req.params.id,
        req.user.id,
        text,
      );
      res.status(201).json(newComment);
    } catch (err) {
      next(err);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const { postId, commentId } = req.params;
      const { post, comment } = await postService.deleteComment(
        postId,
        commentId,
      );

      const currentUserRole = req.user.role;
      const currentUserId = req.user.id;
      const commentAuthorId = comment.user?._id?.toString() || null;
      const commentAuthorRole = comment.user?.role || "user";

      const isOwner = commentAuthorId === currentUserId;
      const isSuper = currentUserRole === "superadmin";
      const isAdmin = currentUserRole === "admin";
      const isTargetHigherRole =
        commentAuthorRole === "admin" || commentAuthorRole === "superadmin";

      if (
        isOwner ||
        isSuper ||
        (isAdmin && !isTargetHigherRole) ||
        !commentAuthorId
      ) {
        post.comments.pull(commentId);
        await post.save();
        return res.json({ message: "Коментар видалено" });
      }

      return res
        .status(403)
        .json({ error: "Недостатньо прав для видалення цього коментаря" });
    } catch (err) {
      next(err);
    }
  }

  async toggleReaction(req, res, next) {
    try {
      const { type } = req.body;
      const validReactions = ["fire", "heart", "clap", "idea"];

      if (!validReactions.includes(type)) {
        return res.status(400).json({ error: "Невалідний тип реакції" });
      }

      const reactions = await postService.toggleReaction(
        req.params.id,
        req.user.id,
        type,
      );
      res.json({ reactions });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PostController();

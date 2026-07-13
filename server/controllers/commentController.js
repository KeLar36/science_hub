const commentService = require("../services/commentService");
const postService = require("../services/postService");

class CommentController {
  async create(req, res, next) {
    try {
      const postId = req.params.id; // ID поста летить в URL
      const { text } = req.body;

      if (!text || !text.trim()) {
        return res
          .status(400)
          .json({ error: "Текст коментаря не може бути порожнім" });
      }

      const newComment = await commentService.create(postId, req.user.id, text);
      res.status(201).json(newComment);
    } catch (err) {
      next(err);
    }
  }

  async getByPostId(req, res, next) {
    try {
      const comments = await commentService.getByPostId(req.params.id);
      res.json(comments);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { commentId } = req.params;

      const comment = await commentService.getById(commentId);

      const post = await postService.getById(comment.postId);

      const currentUserId = req.user.id;
      const currentUserRole = req.user.role;
      const commentAuthorId = comment.userId?._id?.toString() || null;

      const isOwner = commentAuthorId === currentUserId;
      const isSuper = currentUserRole === "superadmin";

      const isAdminOfThisOrg =
        currentUserRole === "admin" &&
        post.organizationId?._id?.toString() ===
          req.user.organizationId?.toString();

      if (isOwner || isSuper || isAdminOfThisOrg) {
        await commentService.delete(commentId);
        return res.json({
          message: "Коментар успішно видалено модератором платформи",
        });
      }

      return res
        .status(403)
        .json({ error: "У вас немає прав для видалення цього коментаря" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CommentController();

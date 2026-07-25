const commentService = require("../services/commentService");
const postService = require("../services/postService");

class CommentController {
  async createPostComment(req, res, next) {
    try {
      const { postId } = req.params;
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
      const { postId } = req.params;
      const comments = await commentService.getByPostId(postId);
      res.json(comments);
    } catch (err) {
      next(err);
    }
  }

  async createProjectComment(req, res, next) {
    try {
      const { projectId } = req.params;
      const { text } = req.body;
      if (!text || !text.trim()) {
        return res
          .status(400)
          .json({ message: "Текст коментаря обов'язковий" });
      }
      const comment = await commentService.createProjectComment(
        projectId,
        req.user.id,
        text,
      );
      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  }

  async getByProjectId(req, res, next) {
    try {
      const { projectId } = req.params;
      const comments = await commentService.getByProjectId(projectId);
      res.json(comments);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const comment = await commentService.getById(id);
      const currentUserId = req.user.id;
      const currentUserRole = req.user.role;
      const commentAuthorId = comment.userId?._id?.toString() || null;

      const isOwner = commentAuthorId === currentUserId;
      const isSuper = currentUserRole === "superadmin";

      let isAdminOfThisOrg = false;
      if (comment.postId) {
        try {
          const post = await postService.getById(comment.postId);
          isAdminOfThisOrg =
            currentUserRole === "admin" &&
            post.organizationId?._id?.toString() ===
              req.user.organizationId?.toString();
        } catch (e) {
          isAdminOfThisOrg = false;
        }
      }

      if (isOwner || isSuper || isAdminOfThisOrg) {
        await commentService.delete(id);
        return res.json({
          message: "Коментар успішно видалено",
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

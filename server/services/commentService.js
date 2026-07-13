const Comment = require("../models/Comment");
const Post = require("../models/Post");

class CommentService {
  async create(postId, userId, text) {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error(
        "Публікацію, яку ви хочете прокоментувати, не знайдено",
      );
      error.statusCode = 404;
      throw error;
    }

    const newComment = new Comment({
      postId,
      userId,
      text: text.trim(),
    });

    await newComment.save();

    return await Comment.findById(newComment._id).populate(
      "userId",
      "name role image",
    );
  }

  async getByPostId(postId) {
    return await Comment.find({ postId })
      .populate("userId", "name role image")
      .sort({ createdAt: 1 });
  }

  async getById(id) {
    const comment = await Comment.findById(id).populate("userId", "name role");
    if (!comment) {
      const error = new Error("Коментар не знайдено");
      error.statusCode = 404;
      throw error;
    }
    return comment;
  }

  async delete(id) {
    const comment = await Comment.findById(id);
    if (!comment) {
      const error = new Error("Коментар не знайдено");
      error.statusCode = 404;
      throw error;
    }
    await Comment.findByIdAndDelete(id);
  }

  async deleteByPostId(postId) {
    await Comment.deleteMany({ postId });
  }
}

module.exports = new CommentService();

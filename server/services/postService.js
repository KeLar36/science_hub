const User = require("../models/User");
const Post = require("../models/Post");

class PostService {
  async getAll(category, page = 1, limit = 8) {
    let query = { status: "published" };
    if (category && category !== "Всі") {
      query.category = category;
    }

    const skip = (page - 1) * limit;
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return { posts, totalPages, currentPage: page };
  }

  async getById(id) {
    const post = await Post.findById(id)
      .populate("authorId", "name role image")
      .populate("comments.user", "name role image");

    if (!post) {
      const error = new Error("Пост не знайдено");
      error.statusCode = 404;
      throw error;
    }

    if (!post.reactions) {
      post.reactions = { fire: [], heart: [], clap: [], idea: [] };
    } else {
      ["fire", "heart", "clap", "idea"].forEach((type) => {
        if (!Array.isArray(post.reactions[type])) {
          post.reactions[type] = [];
        }
      });
    }

    return post;
  }

  async create(authorId, postData, filePath) {
    const newPost = new Post({
      title: postData.title,
      content: postData.content,
      category: postData.category,
      status: postData.status || "published",
      authorId,
      coverImage: filePath || null,
    });
    return await newPost.save();
  }

  async update(id, postData, filePath) {
    let updateData = {
      title: postData.title,
      content: postData.content,
      category: postData.category,
      status: postData.status,
    };

    if (filePath) {
      updateData.coverImage = filePath;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    ).populate("authorId", "name role");

    if (!updatedPost) {
      const error = new Error("Пост не знайдено");
      error.statusCode = 404;
      throw error;
    }

    return updatedPost;
  }

  async delete(id) {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      const error = new Error("Пост не знайдено");
      error.statusCode = 404;
      throw error;
    }
  }

  async addComment(id, userId, text) {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            user: userId,
            text: text.trim(),
          },
        },
      },
      { new: true },
    ).populate("comments.user", "name role image");

    if (!post) {
      const error = new Error("Пост не знайдено");
      error.statusCode = 404;
      throw error;
    }

    return post.comments[post.comments.length - 1];
  }

  async deleteComment(postId, commentId) {
    const post = await Post.findById(postId).populate("comments.user", "role");
    if (!post) {
      const error = new Error("Пост не знайдено");
      error.statusCode = 404;
      throw error;
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      const error = new Error("Коментар не знайдено");
      error.statusCode = 404;
      throw error;
    }

    return { post, comment };
  }

  async toggleReaction(id, userId, type) {
    const post = await Post.findById(id);
    if (!post) {
      const error = new Error("Пост не знайдено");
      error.statusCode = 404;
      throw error;
    }

    if (!post.reactions) post.reactions = {};
    if (!post.reactions[type]) post.reactions[type] = [];

    const hasReacted = post.reactions[type].includes(userId);
    const update = hasReacted
      ? { $pull: { [`reactions.${type}`]: userId } }
      : { $addToSet: { [`reactions.${type}`]: userId } };

    const updatedPost = await Post.findByIdAndUpdate(id, update, { new: true });
    return updatedPost.reactions;
  }
}

module.exports = new PostService();

const Post = require("../models/Post");
const Comment = require("../models/Comment");
const cloudinary = require("cloudinary").v2;

class PostService {
  async #deleteImageFromCloudinary(publicId) {
    if (!publicId) return;
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error(
        `💥 Помилка видалення ресурсу ${publicId} з Cloudinary:`,
        err,
      );
    }
  }

  async getAll(filters = {}, page = 1, limit = 8) {
    let query = {};

    if (filters.status) {
      query.status = filters.status;
    } else {
      query.status = "published";
    }

    if (filters.category && filters.category !== "Всі") {
      query.category = filters.category;
    }

    if (filters.search) {
      query.title = { $regex: filters.search.trim(), $options: "i" };
    }

    if (filters.organizationId) {
      query.organizationId = filters.organizationId;
    }

    const skip = (page - 1) * limit;

    const posts = await Post.find(query)
      .populate("authorId", "name role image")
      .populate("organizationId", "name logo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return { posts, totalPages, currentPage: page, totalItems: total };
  }

  async getById(id) {
    const post = await Post.findById(id)
      .populate("authorId", "name role image")
      .populate("organizationId", "name logo");

    if (!post) {
      const error = new Error("Публікацію не знайдено");
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

    const totalComments = await Comment.countDocuments({ postId: id });

    const postWithCount = post.toObject();
    postWithCount.commentsCount = totalComments;

    return postWithCount;
  }

  async create(authorId, postData, uploadedImages = []) {
    const finalStatus = postData.status || "published";

    const newPost = new Post({
      title: postData.title.trim(),
      content: postData.content,
      category: postData.category,
      domain: postData.domain || null,
      status: finalStatus,
      authorId,
      organizationId: postData.organizationId || null,
      images: uploadedImages,
    });

    return await newPost.save();
  }

  async update(id, postData, newUploadedImages = []) {
    const currentPost = await Post.findById(id);
    if (!currentPost) {
      const error = new Error("Публікацію не знайдено");
      error.statusCode = 404;
      throw error;
    }

    let updateData = {
      title: postData.title.trim(),
      content: postData.content,
      category: postData.category,
      domain: postData.domain || currentPost.domain,
      status: postData.status || currentPost.status,
      organizationId: postData.organizationId || currentPost.organizationId,
    };

    if (newUploadedImages && newUploadedImages.length > 0) {
      if (currentPost.images && currentPost.images.length > 0) {
        for (const img of currentPost.images) {
          if (img.publicId) {
            await this.#deleteImageFromCloudinary(img.publicId);
          }
        }
      }
      updateData.images = newUploadedImages;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    )
      .populate("authorId", "name role")
      .populate("organizationId", "name logo");

    return updatedPost;
  }

  async delete(id) {
    const post = await Post.findById(id).select("images");
    if (!post) {
      const error = new Error("Публікацію не знайдено");
      error.statusCode = 404;
      throw error;
    }

    if (post.images && post.images.length > 0) {
      for (const img of post.images) {
        if (img.publicId) {
          await this.#deleteImageFromCloudinary(img.publicId);
        }
      }
    }

    await Comment.deleteMany({ postId: id });

    await Post.findByIdAndDelete(id);
  }

  async toggleReaction(id, userId, type) {
    const post = await Post.findById(id);
    if (!post) {
      const error = new Error("Публікацію не знайдено");
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

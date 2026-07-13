const User = require("../models/User");
const Post = require("../models/Post");
const cloudinary = require("cloudinary").v2;

class UserService {
  async #deleteImageFromCloudinary(imageUrl) {
    if (!imageUrl || !imageUrl.includes("cloudinary.com")) return;
    try {
      const parts = imageUrl.split("/upload/");
      if (parts.length < 2) return;

      const publicIdWithExtension = parts[1].replace(/^v\d+\//, "");
      const publicId = publicIdWithExtension.substring(
        0,
        publicIdWithExtension.lastIndexOf("."),
      );

      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error("Помилка видалення файлу з Cloudinary:", err);
    }
  }

  async getById(id) {
    const user = await User.findById(id).select("-password");
    if (!user) {
      const error = new Error("Користувача не знайдено");
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async updateProfile(id, profileData) {
    const currentUser = await User.findById(id).select("image");

    if (
      profileData.image &&
      currentUser &&
      currentUser.image &&
      currentUser.image !== profileData.image
    ) {
      await this.#deleteImageFromCloudinary(currentUser.image);
    }

    return await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name: profileData.name,
          bio: profileData.bio,
          topics: profileData.topics,
          city: profileData.city,
          socials: profileData.socials,
          image: profileData.image, // Автоматично перезапише нове посилання
        },
      },
      { new: true, runValidators: true },
    ).select("-password");
  }

  async getBookmarks(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("Користувача не знайдено");
      error.statusCode = 404;
      throw error;
    }
    return await Post.find({ _id: { $in: user.bookmarks } }).sort({
      createdAt: -1,
    });
  }

  async checkBookmark(userId, postId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("Користувача не знайдено");
      error.statusCode = 404;
      throw error;
    }
    return user.bookmarks ? user.bookmarks.includes(postId) : false;
  }

  async getSavedPosts(userId) {
    const user = await User.findById(userId).populate({
      path: "bookmarks",
      model: "Post",
    });

    if (!user) {
      const error = new Error("Користувача не знайдено");
      error.statusCode = 404;
      throw error;
    }
    return user.bookmarks || [];
  }

  async toggleBookmark(userId, postId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("Користувача не знайдено");
      error.statusCode = 404;
      throw error;
    }

    if (!user.bookmarks) user.bookmarks = [];

    const index = user.bookmarks.indexOf(postId);
    if (index === -1) {
      user.bookmarks.push(postId);
    } else {
      user.bookmarks.splice(index, 1);
    }

    await user.save();
    return index === -1;
  }

  async getCommunity() {
    return await User.find(
      { isBanned: false },
      "name role image bio topics city socials status organizationId createdAt",
    ).sort({ status: 1, createdAt: -1 });
  }

  async getUsers(queryFilters, page = 1, limit = 8) {
    const skip = (page - 1) * limit;
    const users = await User.find(queryFilters)
      .select("-password")
      .populate("organizationId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(queryFilters);
    const totalPages = Math.ceil(total / limit);

    return { users, totalPages, currentPage: page };
  }

  async countUsers(queryFilters) {
    return await User.countDocuments(queryFilters);
  }

  async updateRole(id, role, extraData = {}) {
    const targetUser = await User.findById(id);
    if (!targetUser) {
      const error = new Error("Користувача не знайдено");
      error.statusCode = 404;
      throw error;
    }

    let updateQuery = {};

    if (role === "reviewer") {
      updateQuery = {
        $set: {
          role: role,
          allowedDomains: extraData.allowedDomains || [],
          allowedTypes: extraData.allowedTypes || [],
        },
      };
    } else {
      updateQuery = {
        $set: { role: role },
        $unset: {
          allowedDomains: 1,
          allowedTypes: 1,
        },
      };
    }

    return await User.findByIdAndUpdate(id, updateQuery, {
      new: true,
      runValidators: true,
      overwriteDiscriminatorKey: true,
    });
  }

  async updateBanStatus(id, isBanned) {
    return await User.findByIdAndUpdate(id, { isBanned }, { new: true }).select(
      "-password",
    );
  }

  async delete(id) {
    const user = await User.findById(id).select("image");
    if (user && user.image) {
      await this.#deleteImageFromCloudinary(user.image);
    }
    await User.findByIdAndDelete(id);
  }
}

module.exports = new UserService();

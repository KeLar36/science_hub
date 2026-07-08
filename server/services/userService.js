const User = require("../models/User");
const Post = require("../models/Post");

class UserService {
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
    return await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name: profileData.name,
          bio: profileData.bio,
          topics: profileData.topics,
          city: profileData.city,
          socials: profileData.socials,
          image: profileData.image,
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

  async updateRole(id, role) {
    const targetUser = await User.findById(id);
    if (!targetUser) {
      const error = new Error("Користувача не знайдено");
      error.statusCode = 404;
      throw error;
    }

    targetUser.role = role;
    return await targetUser.save();
  }

  async updateBanStatus(id, isBanned) {
    return await User.findByIdAndUpdate(id, { isBanned }, { new: true }).select(
      "-password",
    );
  }

  async delete(id) {
    await User.findByIdAndDelete(id);
  }
}

module.exports = new UserService();

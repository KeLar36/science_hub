const User = require("../models/User");
const Post = require("../models/Post");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");

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
      console.error("💥 Помилка видалення файлу з Cloudinary:", err);
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
      { $set: profileData },
      { new: true, runValidators: true },
    ).select("-password");
  }

  async getPagedUsers(queryFilters, page = 1, limit = 8) {
    const skip = (page - 1) * limit;

    const users = await User.find(queryFilters)
      .select("-password")
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

  async anonymizeUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("Користувача не знайдено");
      error.statusCode = 404;
      throw error;
    }

    const Organization = mongoose.model("Organization");

    // =========================================================================
    // 🛡️ КРОК 1: Перевірка на засновника активної організації
    // =========================================================================
    const ownedOrg = await Organization.findOne({ creatorId: userId });
    if (ownedOrg) {
      // Якщо він єдиний член і творець — змушуємо спочатку видалити установу
      if (ownedOrg.members.length <= 1) {
        const error = new Error(
          "Ви є єдиним членом та засновником установи. Будь ласка, видаліть установу перед анонімізацією профілю.",
        );
        error.statusCode = 400;
        throw error;
      }

      const error = new Error(
        "Ви є засновником організації. Передайте права власності іншому учаснику перед анонімізацією.",
      );
      error.statusCode = 400;
      throw error;
    }

    // =========================================================================
    // 🛡️ КРОК 2: Видалення з членів усіх організацій
    // =========================================================================
    await Organization.updateMany(
      { members: userId },
      { $pull: { members: userId } },
    );

    // =========================================================================
    // 🛡️ КРОК 3: Очищення медіа та файлів профілю з Cloudinary
    // =========================================================================
    if (user.image) {
      await this.#deleteImageFromCloudinary(user.image);
    }

    // =========================================================================
    // 🛡️ КРОК 4: Анонімізація персональних даних у БД (GDPR-friendly)
    // =========================================================================
    const anonymizedEmail = `deleted_${userId}_${Date.now()}@scienceplatform.com`;

    user.name = "Анонімний дослідник";
    user.email = anonymizedEmail;
    user.password = `anonymized_${Date.now()}_${Math.random().toString(36).substring(2)}`; // Перезаписуємо випадковим паролем
    user.image = null;
    user.bio =
      "Цей акаунт було видалено користувачем за власним бажанням відповідно до політики GDPR.";
    user.topics = [];
    user.city = "";
    user.socials = { github: "", twitter: "", linkedIn: "" };
    user.bookmarks = [];
    user.organizationId = null;
    user.pendingOrganizationId = undefined;

    user.role = "user";

    if (user.allowedDomains) user.allowedDomains = [];
    if (user.allowedTypes) user.allowedTypes = [];

    await user.save();
    console.log(
      `🧼 Користувача ${userId} успішно анонімізовано за стандартами GDPR.`,
    );
    return user;
  }
}

module.exports = new UserService();

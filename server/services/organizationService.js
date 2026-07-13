const Organization = require("../models/Organization");
const User = require("../models/User");
const Program = require("../models/Program");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

class OrganizationService {
  constructor() {
    this.publicListCache = null;
    this.cacheTimestamp = null;
  }

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
      console.error(
        "💥 Помилка видалення логотипу установи з Cloudinary:",
        err,
      );
    }
  }

  async getOrganizationUsers(orgId, page = 1, limit = 8) {
    const skip = (page - 1) * limit;

    const org = await Organization.findById(orgId).select("members").populate({
      path: "members",
      select: "name email role city socials isBanned",
      options: { skip, limit },
    });

    if (!org) {
      const error = new Error("Організацію не знайдено");
      error.statusCode = 404;
      throw error;
    }

    const totalOrg = await Organization.findById(orgId).select("members");
    const totalItems = totalOrg?.members?.length || 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: org.members || [],
      currentPage: page,
      totalPages: totalPages || 1,
      totalItems,
    };
  }

  async getOrganizationPrograms(orgId, page = 1, limit = 8) {
    const skip = (page - 1) * limit;

    const totalItems = await Program.countDocuments({ organizationId: orgId });
    const totalPages = Math.ceil(totalItems / limit);

    const programs = await Program.find({ organizationId: orgId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      items: programs,
      currentPage: page,
      totalPages: totalPages || 1,
      totalItems,
    };
  }

  async getAll(query = {}, page = 1, limit = 8) {
    const skip = (page - 1) * limit;

    const organizations = await Organization.find(query)
      .populate("creatorId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Organization.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return { organizations, totalPages, currentPage: page };
  }

  async getPublicList() {
    const CACHE_TTL = 10 * 60 * 1000;
    const now = Date.now();

    if (this.publicListCache && now - this.cacheTimestamp < CACHE_TTL) {
      return this.publicListCache;
    }

    const list = await Organization.find({ status: "approved" }).select(
      "name logo website description edrpou type city scientificDomains isVerified email",
    );

    this.publicListCache = list;
    this.cacheTimestamp = now;

    return list;
  }

  async getById(id) {
    const organization = await Organization.findById(id)
      .populate("creatorId", "name email")
      .populate("members", "name email role");

    if (!organization) {
      const error = new Error("Організацію не знайдено");
      error.statusCode = 404;
      throw error;
    }
    return organization;
  }

  async create(userId, data) {
    const activeOrg = await Organization.findOne({
      edrpou: data.edrpou.trim(),
      status: { $in: ["pending", "approved"] },
    });

    if (activeOrg) {
      const error = new Error(
        "Організація з таким кодом ЄДРПОУ вже зареєстрована або очікує на модерацію",
      );
      error.statusCode = 400;
      throw error;
    }

    const newOrg = new Organization({
      name: data.name.trim(),
      edrpou: data.edrpou.trim(),
      description: data.description || "",
      website: data.website || "",
      logo: data.logo || null,
      email: data.email ? data.email.trim().toLowerCase() : "",
      type: data.type || "Університет",
      legalForm: data.legalForm || "ДУ/КЗ",
      city: data.city || "Київ",
      scientificDomains: data.scientificDomains || [],
      creatorId: userId,
      status: "pending",
      members: [userId],
    });

    await newOrg.save();

    await User.findByIdAndUpdate(userId, {
      pendingOrganizationId: newOrg._id,
    });

    return newOrg;
  }

  async updateStatus(id, status) {
    const org = await Organization.findById(id);
    if (!org) {
      const error = new Error("Організацію не знайдено");
      error.statusCode = 404;
      throw error;
    }

    org.status = status;
    this.publicListCache = null;

    if (status === "approved") {
      org.isVerified = true;

      if (org.edrpou.includes("-rejected-")) {
        org.edrpou = org.edrpou.split("-rejected-")[0];
      }
      org.name = org.name.replace(/\s*\(Відхилено\)/g, "").trim();

      const creatorUserId = org.creatorId._id
        ? org.creatorId._id
        : org.creatorId;

      const updatedUser = await User.findByIdAndUpdate(
        creatorUserId,
        {
          $set: {
            role: "admin",
            organizationId: org._id,
          },
          $unset: {
            pendingOrganizationId: 1,
          },
        },
        {
          new: true,
          runValidators: false,
          overwriteDiscriminatorKey: true,
        },
      );

      if (updatedUser) {
        console.log(
          `🎯 Роль засновника успішно змінено на ${updatedUser.role}!`,
        );
      }
    }

    if (status === "rejected") {
      org.isVerified = false;
      org.edrpou = `${org.edrpou}-rejected-${Date.now()}`;
      org.name = `${org.name} (Відхилено)`;

      await User.findByIdAndUpdate(org.creatorId, {
        $unset: { pendingOrganizationId: 1 },
      });
    }

    await org.save();
    return org;
  }

  async requestToJoin(orgId, userId) {
    const organization = await Organization.findById(orgId);
    if (!organization) {
      const error = new Error("Організацію не знайдено");
      error.statusCode = 404;
      throw error;
    }

    if (organization.status !== "approved") {
      const error = new Error("Не можна вступити до непідтвердженої установи");
      error.statusCode = 400;
      throw error;
    }

    const alreadyRequested = organization.joinRequests.some(
      (req) => req.userId.toString() === userId.toString(),
    );
    if (alreadyRequested) {
      const error = new Error(
        "Ви вже надіслали запит на вступ до цієї установи",
      );
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findById(userId);
    if (user.organizationId) {
      const error = new Error("Ви вже є членом іншої організації");
      error.statusCode = 400;
      throw error;
    }

    organization.joinRequests.push({ userId });
    await organization.save();
  }

  async acceptJoinRequest(orgId, userId) {
    const organization = await Organization.findById(orgId);
    if (!organization) {
      const error = new Error("Організацію не знайдено чи доступ обмежено");
      error.statusCode = 404;
      throw error;
    }

    organization.joinRequests = organization.joinRequests.filter(
      (req) => req.userId.toString() !== userId.toString(),
    );

    if (!organization.members.includes(userId)) {
      organization.members.push(userId);
    }

    await organization.save();

    await User.findByIdAndUpdate(userId, {
      organizationId: orgId,
    });
  }

  async rejectJoinRequest(orgId, userId) {
    const organization = await Organization.findById(orgId);
    if (!organization) {
      const error = new Error("Організацію не знайдено");
      error.statusCode = 404;
      throw error;
    }

    organization.joinRequests = organization.joinRequests.filter(
      (req) => req.userId.toString() !== userId.toString(),
    );
    await organization.save();
  }

  async getPagedPendingRequests(orgId, { page = 1, limit = 8, search = "" }) {
    if (!orgId) {
      return { items: [], currentPage: page, totalPages: 1, totalItems: 0 };
    }

    const cleanOrgId = orgId._id ? orgId._id.toString() : orgId.toString();
    const skip = (page - 1) * limit;

    const rawOrg =
      await Organization.findById(cleanOrgId).select("joinRequests");

    if (!rawOrg || !rawOrg.joinRequests || rawOrg.joinRequests.length === 0) {
      return {
        items: [],
        currentPage: page,
        totalPages: 1,
        totalItems: 0,
      };
    }

    const basePipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(cleanOrgId) } },
      { $unwind: { path: "$joinRequests", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "joinRequests.userId",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      {
        $project: {
          _id: "$joinRequests._id",
          createdAt: "$joinRequests.createdAt",
          user: {
            _id: "$userData._id",
            name: "$userData.name",
            email: "$userData.email",
            image: "$userData.image",
          },
        },
      },
    ];

    if (search.trim()) {
      basePipeline.push({
        $match: {
          $or: [
            { "user.name": { $regex: search.trim(), $options: "i" } },
            { "user.email": { $regex: search.trim(), $options: "i" } },
          ],
        },
      });
    }

    const allResults = await Organization.aggregate(basePipeline);
    const totalItems = allResults.length;
    const totalPages = Math.ceil(totalItems / limit);

    const itemsPipeline = [
      ...basePipeline,
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const items = await Organization.aggregate(itemsPipeline);

    return {
      items,
      currentPage: page,
      totalPages: totalPages || 1,
      totalItems,
    };
  }

  async leaveOrganization(userId) {
    const user = await User.findById(userId);
    if (!user || !user.organizationId) {
      const error = new Error("Ви не перебуваєте в жодній установі");
      error.statusCode = 400;
      throw error;
    }

    const org = await Organization.findById(user.organizationId);
    if (org && org.creatorId.toString() === userId.toString()) {
      const error = new Error(
        "Творець організації не може вийти з неї. Тільки видалити або передати права.",
      );
      error.statusCode = 400;
      throw error;
    }

    await Organization.findByIdAndUpdate(user.organizationId, {
      $pull: { members: userId },
    });

    if (["admin", "content-manager"].includes(user.role)) {
      user.role = "user";
    }
    user.organizationId = null;
    await user.save();
  }

  async kickMember(orgId, adminUserId, targetUserId) {
    const org = await Organization.findById(orgId);
    if (!org) {
      const error = new Error("Установу не знайдено");
      error.statusCode = 404;
      throw error;
    }

    if (org.creatorId.toString() !== adminUserId.toString()) {
      const error = new Error("Недостатньо прав для виключення учасників");
      error.statusCode = 403;
      throw error;
    }

    if (targetUserId.toString() === org.creatorId.toString()) {
      const error = new Error("Не можна виключити засновника організації");
      error.statusCode = 400;
      throw error;
    }

    org.members = org.members.filter(
      (m) => m.toString() !== targetUserId.toString(),
    );
    await org.save();

    const user = await User.findById(targetUserId);
    if (user) {
      if (["admin", "content-manager"].includes(user.role)) {
        user.role = "user";
      }
      user.organizationId = null;
      await user.save();
    }
  }

  async transferOwnership(orgId, currentOwnerId, newOwnerId) {
    const org = await Organization.findById(orgId);
    if (!org) {
      const error = new Error("Організацію не знайдено");
      error.statusCode = 404;
      throw error;
    }

    if (org.creatorId.toString() !== currentOwnerId.toString()) {
      const error = new Error(
        "Тільки засновник організації може передати права власності!",
      );
      error.statusCode = 403;
      throw error;
    }

    if (!org.members.includes(newOwnerId)) {
      const error = new Error(
        "Новий власник повинен бути членом цієї організації!",
      );
      error.statusCode = 400;
      throw error;
    }

    org.creatorId = newOwnerId;
    await org.save();

    await User.findByIdAndUpdate(
      newOwnerId,
      {
        role: "admin",
        organizationId: orgId,
      },
      { overwriteDiscriminatorKey: true },
    );

    await User.findByIdAndUpdate(
      currentOwnerId,
      {
        role: "user",
      },
      { overwriteDiscriminatorKey: true },
    );

    console.log(
      `👑 Права власності на організацію "${org.name}" успішно передано від ${currentOwnerId} до ${newOwnerId}`,
    );
  }

  async deleteOrganization(orgId, requestUserId, userRole) {
    const org = await Organization.findById(orgId).select(
      "creatorId logo members",
    );
    if (!org) {
      const error = new Error("Установу не знайдено");
      error.statusCode = 404;
      throw error;
    }

    if (
      org.creatorId.toString() !== requestUserId.toString() &&
      userRole !== "superadmin"
    ) {
      const error = new Error("Немає прав на видалення цієї організації");
      error.statusCode = 403;
      throw error;
    }

    console.log(
      `🧹 Початок глобального каскадного видалення установи ${orgId}...`,
    );

    // =========================================================================
    // 📦 КРОК 1: Очищення медіа-блогу установи (Пости + Коментарі + Cloudinary)
    // =========================================================================
    try {
      const posts = await Post.find({ organizationId: orgId });
      let deletedPostsCount = 0;

      for (const post of posts) {
        if (post.images && post.images.length > 0) {
          for (const img of post.images) {
            if (img.publicId) {
              await cloudinary.uploader.destroy(img.publicId);
            }
          }
        }
        await Comment.deleteMany({ postId: post._id });
        await Post.findByIdAndDelete(post._id);
        deletedPostsCount++;
      }
      console.log(
        `  ↳ 🟢 Медіа-блог зачищено: видалено ${deletedPostsCount} постів разом з їхніми коментарями.`,
      );
    } catch (err) {
      console.error("💥 Помилка при видаленні медіа-блогу установи:", err);
    }

    // =========================================================================
    // 📦 КРОК 2: Гібридне каскадне видалення програм та проєктів (Soft/Hard Delete)
    // =========================================================================
    try {
      const programs = await Program.find({ organizationId: orgId }).select(
        "_id",
      );
      const programIds = programs.map((p) => p._id);

      if (programIds.length > 0) {
        await projectService.handleProgramDeletion(programIds);

        const Project = mongoose.model("Project");
        await Project.updateMany(
          {
            programId: { $in: programIds },
            status: { $in: ["На розгляді", "Прийнято"] },
          },
          {
            $set: {
              programId: null,
              reviewerId: null,
              reviewStatus: "Не призначено",
            },
          },
        );

        await Program.deleteMany({ organizationId: orgId });

        console.log(
          `  ↳ 🟢 Наукові програми (${programIds.length} од.) успішно ліквідовано.`,
        );
      }
    } catch (err) {
      console.error(
        "💥 Помилка при каскадному видаленні наукових програм/проєктів:",
        err,
      );
    }

    // =========================================================================
    // 📦 КРОК 3: Робота з членами організації (Зміна ролей та лінків)
    // =========================================================================
    try {
      // Для всіх звичайних членів організації зануляємо зв'язок
      await User.updateMany(
        {
          organizationId: orgId,
          _id: { $ne: org.creatorId },
          role: { $ne: "content-manager" }, // менеджерів обробимо окремо нижче
        },
        { $set: { organizationId: null } },
      );

      // 2. Локальних менеджерів контенту ми прицільно скидаємо на "user"
      const managers = await User.find({
        organizationId: orgId,
        role: "content-manager",
      });
      for (const manager of managers) {
        manager.role = "user";
        manager.organizationId = null;
        await manager.save();
      }

      // 3. Засновника скидаємо на "user"
      await User.findByIdAndUpdate(
        org.creatorId,
        {
          $set: { role: "user", organizationId: null },
          $unset: { pendingOrganizationId: 1 },
        },
        {
          overwriteDiscriminatorKey: true,
          runValidators: true,
        },
      );
      console.log(
        "  ↳ 🟢 Усіх членів установи звільнено, роль засновника скинуто на 'user'.",
      );
    } catch (err) {
      console.error("💥 Помилка при скиданні зв'язків користувачів:", err);
    }

    // =========================================================================
    // 📦 КРОК 4: Видалення системних файлів установи та самої сутності
    // =========================================================================
    this.publicListCache = null;

    if (org.logo) {
      await this.#deleteImageFromCloudinary(org.logo);
    }

    await Organization.findByIdAndDelete(orgId);
    console.log(
      `🏆 Установу ${orgId} повністю та безповоротно видалено з системи!`,
    );
  }
}

module.exports = new OrganizationService();

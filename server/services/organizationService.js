const Organization = require("../models/Organization");
const { containsBadWords } = require("../shared/profanityFilter");
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
    this.CACHE_TTL = 10 * 60 * 1000;
  }

  clearCache() {
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
      console.error("Помилка видалення логотипу установи з Cloudinary:", err);
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

  async getPublicList(filter = { status: "approved", allowPublicJoin: true }) {
    const now = Date.now();

    if (this.publicListCache && now - this.cacheTimestamp < this.CACHE_TTLL) {
      return this.publicListCache;
    }

    const list = await Organization.find(filter)
      .select(
        "name logo website description edrpou type city scientificDomains isVerified email allowPublicJoin",
      )
      .lean();

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
    const cleanEdrpou = data.edrpou ? data.edrpou.trim() : "";

    const activeOrg = await Organization.findOne({
      edrpou: cleanEdrpou,
      status: { $in: ["pending", "approved"] },
    });

    if (activeOrg) {
      const error = new Error(
        "Організація з таким кодом ЄДРПОУ вже зареєстрована або очікує на модерацію",
      );
      error.statusCode = 400;
      throw error;
    }

    if (
      containsBadWords(data.name) ||
      containsBadWords(data.description) ||
      containsBadWords(data.email) ||
      containsBadWords(data.city)
    ) {
      const error = new Error(
        "Назва, опис, email або місто містять недопустимі або образливі слова!",
      );
      error.statusCode = 400;
      throw error;
    }

    // Обробка наукових галузей
    let domains = data.scientificDomains || [];
    if (typeof domains === "string") {
      try {
        domains = JSON.parse(domains);
      } catch (e) {
        domains = domains.split(",").map((d) => d.trim());
      }
    }

    const newOrg = new Organization({
      name: data.name ? data.name.trim() : "",
      edrpou: cleanEdrpou,
      description: data.description || "",
      website: data.website || "",
      logo: data.logo || null,
      email: data.email ? data.email.trim().toLowerCase() : "",
      type: data.type || "Університет",
      legalForm: data.legalForm || "ДУ/КЗ",
      city: data.city ? data.city.trim() : "Київ",
      scientificDomains: Array.isArray(domains) ? domains : [],
      creatorId: userId,
      status: "pending",
      isVerified: false,
      members: [userId],
    });

    await newOrg.save();

    await User.findByIdAndUpdate(userId, {
      pendingOrganizationId: newOrg._id,
    });

    return newOrg;
  }

  async update(orgId, updateData, file) {
    const cleanOrgId = orgId?._id ? orgId._id.toString() : orgId?.toString();

    const org = await Organization.findById(cleanOrgId);
    if (!org) {
      const error = new Error("Організацію не знайдено");
      error.statusCode = 404;
      throw error;
    }

    if (
      (updateData.name && containsBadWords(updateData.name)) ||
      (updateData.description && containsBadWords(updateData.description)) ||
      (updateData.email && containsBadWords(updateData.email)) ||
      (updateData.city && containsBadWords(updateData.city))
    ) {
      const error = new Error(
        "Текст містить недопустимий або образливий контент!",
      );
      error.statusCode = 400;
      throw error;
    }

    const allowedFields = [
      "name",
      "city",
      "email",
      "website",
      "description",
      "type",
      "legalForm",
      "scientificDomains",
      "allowPublicJoin",
    ];

    const fieldsToUpdate = {};

    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        if (field === "allowPublicJoin") {
          fieldsToUpdate[field] =
            updateData[field] === true || updateData[field] === "true";
        } else if (field === "scientificDomains") {
          let domains = updateData[field];

          if (typeof domains === "string") {
            try {
              domains = JSON.parse(domains);
            } catch (e) {
              domains = domains.split(",").map((d) => d.trim());
            }
          }

          if (Array.isArray(domains)) {
            const cleaned = domains
              .map((d) => {
                if (typeof d !== "string") return d;
                return d.replace(/^[\["'\s]+|[\]"'\s]+$/g, "").trim();
              })
              .filter((d) => d && d !== "[]");

            fieldsToUpdate[field] = Array.from(new Set(cleaned));
          } else {
            fieldsToUpdate[field] = [];
          }
        } else {
          fieldsToUpdate[field] = updateData[field];
        }
      }
    });

    if (file?.path) {
      fieldsToUpdate.logo = file.path;
    }

    const isLogoChanged = file?.path && file.path !== org.logo;
    const isNameChanged =
      updateData.name && updateData.name.trim() !== org.name;

    if (!org.isSystem && org.isVerified && (isLogoChanged || isNameChanged)) {
      fieldsToUpdate.isVerified = false;
    }

    const updatedOrg = await Organization.findByIdAndUpdate(
      cleanOrgId,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true },
    );

    this.clearCache();

    return updatedOrg;
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

    const creatorUserId = org.creatorId._id || org.creatorId;

    if (status === "approved") {
      org.isVerified = true;

      if (org.edrpou.includes("-rejected-")) {
        org.edrpou = org.edrpou.split("-rejected-")[0];
      }
      org.name = org.name.replace(/\s*\(Відхилено\)/g, "").trim();

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
        console.log(`Роль засновника успішно змінено на ${updatedUser.role}!`);
      }
    }

    if (status === "rejected") {
      org.isVerified = false;
      org.edrpou = `${org.edrpou}-rejected-${Date.now()}`;
      org.name = `${org.name} (Відхилено)`;

      await User.findByIdAndUpdate(creatorUserId, {
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

    if (organization.allowPublicJoin === false) {
      const error = new Error(
        "Ця організація закрила можливість надсилання публічних заявок на вступ",
      );
      error.statusCode = 403;
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

    const isAlreadyMember = organization.members.some(
      (memberId) => memberId.toString() === userId.toString(),
    );

    if (!isAlreadyMember) {
      organization.members.push(userId);
    }

    await organization.save();

    const user = await User.findById(userId);
    if (user) {
      user.organizationId = orgId;

      if (user.role === "reviewer") {
        user.isReviewerActive = true;
      }

      await user.save();
    }
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

    const basePipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(cleanOrgId) } },
      { $unwind: { path: "$joinRequests", preserveNullAndEmptyArrays: false } },
      {
        $lookup: {
          from: "users",
          localField: "joinRequests.userId",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
    ];

    if (search.trim()) {
      basePipeline.push({
        $match: {
          $or: [
            { "userData.name": { $regex: search.trim(), $options: "i" } },
            { "userData.email": { $regex: search.trim(), $options: "i" } },
          ],
        },
      });
    }

    const countPipeline = [...basePipeline, { $count: "total" }];
    const countResult = await Organization.aggregate(countPipeline);
    const totalItems = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalItems / limit) || 1;

    const itemsPipeline = [
      ...basePipeline,
      { $sort: { "joinRequests.createdAt": -1 } },
      { $skip: skip },
      { $limit: limit },
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

    const items = await Organization.aggregate(itemsPipeline);

    return {
      items,
      currentPage: page,
      totalPages,
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

    const originalRole = user.role;

    user.organizationId = null;

    user.role = "user";

    if (originalRole === "reviewer") {
      user.isReviewerActive = false;
      user.allowedDomains = [];
      user.allowedTypes = [];
    }

    await user.save();
  }

  async kickMember(orgId, adminUser, targetUserId) {
    const org = await Organization.findById(orgId);
    if (!org) {
      const error = new Error("Установу не знайдено");
      error.statusCode = 404;
      throw error;
    }

    const isSuperAdmin = adminUser.role === "superadmin";
    const isCreator =
      org.creatorId.toString() === (adminUser._id || adminUser.id).toString();

    if (!isCreator && !isSuperAdmin) {
      const error = new Error(
        "Тільки засновник або суперадмін може виключати учасників",
      );
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
      user.organizationId = null;

      if (user.role !== "superadmin") {
        if (user.role === "reviewer") {
          user.isReviewerActive = false;
          user.allowedDomains = [];
          user.allowedTypes = [];
        }
        user.role = "user";
      }

      await user.save();
    }
  }

  async updateMemberRole(orgId, adminUserId, targetUserId, newRole) {
    const cleanOrgId = orgId?._id ? orgId._id.toString() : orgId?.toString();

    const org = await Organization.findById(cleanOrgId);
    if (!org) {
      const error = new Error("Установу не знайдено");
      error.statusCode = 404;
      throw error;
    }

    if (org.creatorId.toString() !== adminUserId.toString()) {
      const error = new Error(
        "Тільки засновник організації може змінювати ролі учасників",
      );
      error.statusCode = 403;
      throw error;
    }

    if (targetUserId.toString() === org.creatorId.toString()) {
      const error = new Error("Не можна змінити роль засновника організації");
      error.statusCode = 400;
      throw error;
    }

    const isMember = org.members.some(
      (m) => m.toString() === targetUserId.toString(),
    );

    if (!isMember) {
      const error = new Error("Користувач не є членом цієї організації");
      error.statusCode = 404;
      throw error;
    }

    const updateData = { role: newRole };

    if (newRole === "reviewer") {
      updateData.isReviewerActive = true;
    }

    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      { $set: updateData },
      {
        new: true,
        runValidators: false,
        overwriteDiscriminatorKey: true,
      },
    ).select("name email role organizationId isReviewerActive");

    return updatedUser;
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

    const isMember = org.members.some(
      (memberId) => memberId.toString() === newOwnerId.toString(),
    );

    if (!isMember) {
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

    const currentOwner = await User.findById(currentOwnerId);
    if (currentOwner && currentOwner.role !== "superadmin") {
      currentOwner.role = "user";
      await currentOwner.save();
    }

    console.log(
      `Права власності на організацію "${org.name}" успішно передано від ${currentOwnerId} до ${newOwnerId}`,
    );
  }

  async deleteOrganization(orgId, requestUserId, userRole) {
    const org = await Organization.findById(orgId).select(
      "creatorId logo members isSystem",
    );
    if (!org) {
      const error = new Error("Установу не знайдено");
      error.statusCode = 404;
      throw error;
    }

    if (org.isSystem) {
      const error = new Error(
        "Системну організацію 'Science Platform' заборонено видаляти!",
      );
      error.statusCode = 400;
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
      `Початок глобального каскадного видалення установи ${orgId}...`,
    );

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
        `  ↳ Медіа-блог зачищено: видалено ${deletedPostsCount} постів разом з їхніми коментарями.`,
      );
    } catch (err) {
      console.error("Помилка при видаленні медіа-блогу установи:", err);
    }

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
          `  ↳ Наукові програми (${programIds.length} од.) успішно ліквідовано.`,
        );
      }
    } catch (err) {
      console.error(
        "Помилка при каскадному видаленні наукових програм/проєктів:",
        err,
      );
    }

    try {
      await User.updateMany(
        { organizationId: orgId, role: "reviewer" },
        { $set: { isReviewerActive: false } },
      );

      await User.updateMany(
        { organizationId: orgId },
        { $set: { organizationId: null } },
      );

      const managers = await User.find({
        organizationId: orgId,
        role: "content-manager",
      });
      for (const manager of managers) {
        manager.role = "user";
        manager.organizationId = null;
        await manager.save();
      }

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
        "  ↳ Усіх членів установи звільнено, роль засновника скинуто на 'user'.",
      );
    } catch (err) {
      console.error("Помилка при скиданні зв'язків користувачів:", err);
    }
    this.publicListCache = null;

    if (org.logo) {
      await this.#deleteImageFromCloudinary(org.logo);
    }

    await Organization.findByIdAndDelete(orgId);
    console.log(
      `Установу ${orgId} повністю та безповоротно видалено з системи!`,
    );
  }
}

module.exports = new OrganizationService();

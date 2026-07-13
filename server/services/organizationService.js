const Organization = require("../models/Organization");
const User = require("../models/User");
const Project = require("../models/Project");
const Program = require("../models/Program");
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

    const User = mongoose.model("User");
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

      const User = mongoose.model("User");

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
        { new: true, runValidators: false },
      );

      if (updatedUser) {
        console.log(
          `🎯 Роль користувача успішно змінено на ${updatedUser.role} у базі даних!`,
        );
      } else {
        console.error(
          `❌ Не вдалося знайти та оновити користувача з ID ${creatorUserId}`,
        );
      }
    }

    if (status === "rejected") {
      org.isVerified = false;
      org.edrpou = `${org.edrpou}-rejected-${Date.now()}`;
      org.name = `${org.name} (Відхилено)`;

      const User = mongoose.model("User");
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

    await User.findByIdAndUpdate(targetUserId, { organizationId: null });
  }

  async deleteOrganization(orgId, requestUserId, userRole) {
    const org = await Organization.findById(orgId).select("creatorId logo");
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

    await User.updateMany(
      { organizationId: orgId },
      { $set: { organizationId: null } },
    );

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

    this.publicListCache = null;

    if (org.logo) {
      await this.#deleteImageFromCloudinary(org.logo);
    }

    await Organization.findByIdAndDelete(orgId);
  }
}

module.exports = new OrganizationService();

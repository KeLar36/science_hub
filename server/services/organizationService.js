const Organization = require("../models/Organization");
const User = require("../models/User");
const Project = require("../models/Project");
const Program = require("../models/Program");
const mongoose = require("mongoose");

class OrganizationService {
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
    return await Organization.find({ status: "approved" }).select(
      "name logo website description edrpou type city scientificDomains isVerified",
    );
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

    if (status === "approved") {
      org.isVerified = true;

      if (org.edrpou.includes("-rejected-")) {
        org.edrpou = org.edrpou.split("-rejected-")[0];
      }
      org.name = org.name.replace(/\s*\(Відхилено\)/g, "").trim();

      const User = mongoose.model("User");
      await User.findByIdAndUpdate(org.creatorId, {
        role: "admin",
        organizationId: org._id,
        $unset: { pendingOrganizationId: 1 },
      });
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
    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(orgId) } },

      { $unwind: "$joinRequests" },

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
      pipeline.push({
        $match: {
          $or: [
            { "user.name": { $regex: search.trim(), $options: "i" } },
            { "user.email": { $regex: search.trim(), $options: "i" } },
          ],
        },
      });
    }

    const allResults = await Organization.aggregate(pipeline);
    const totalItems = allResults.length;
    const totalPages = Math.ceil(totalItems / limit);

    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    );

    const items = await Organization.aggregate(pipeline);

    return {
      items,
      currentPage: page,
      totalPages: totalPages || 1,
      totalItems,
    };
  }
}

module.exports = new OrganizationService();

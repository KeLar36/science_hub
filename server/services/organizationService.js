const Organization = require("../models/Organization");
const User = require("../models/User");
const Project = require("../models/Project");
const Program = require("../models/Program");

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

  async getOrganizationProjects(orgId, page = 1, limit = 8) {
    const skip = (page - 1) * limit;

    const org = await Organization.findById(orgId).select("members");
    if (!org) {
      const error = new Error("Організацію не знайдено");
      error.statusCode = 404;
      throw error;
    }

    const memberIds = org.members || [];

    const totalItems = await Project.countDocuments({
      authorId: { $in: memberIds },
    });
    const totalPages = Math.ceil(totalItems / limit);

    const projects = await Project.find({ authorId: { $in: memberIds } })
      .populate("authorId", "name email")
      .populate("programId", "title type")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      items: projects,
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

  async getAll(page = 1, limit = 8) {
    const skip = (page - 1) * limit;
    const organizations = await Organization.find()
      .populate("creatorId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Organization.countDocuments();
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

    await User.findByIdAndUpdate(userId, {
      role: "admin",
      organizationId: newOrg._id,
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
    }

    if (status === "rejected") {
      org.isVerified = false;
      org.edrpou = `${org.edrpou}-rejected-${Date.now()}`;
      org.name = `${org.name} (Відхилено)`;

      await User.findByIdAndUpdate(org.creatorId, {
        role: "user",
        organizationId: null,
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
}

module.exports = new OrganizationService();

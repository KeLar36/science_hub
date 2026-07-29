const Project = require("../models/Project");
const User = require("../models/User");
const Program = require("../models/Program");
const cloudinary = require("cloudinary").v2;

class ProjectService {
  async #deleteFileFromCloudinary(fileUrl) {
    if (!fileUrl || !fileUrl.includes("cloudinary.com")) return;
    try {
      const parts = fileUrl.split("/upload/");
      if (parts.length < 2) return;

      const publicIdWithExtension = parts[1].replace(/^v\d+\//, "");
      const publicId = publicIdWithExtension.substring(
        0,
        publicIdWithExtension.lastIndexOf("."),
      );

      await cloudinary.uploader
        .destroy(publicId, { resource_type: "raw" })
        .catch(() => {});
      await cloudinary.uploader
        .destroy(publicId, { resource_type: "image" })
        .catch(() => {});
    } catch (err) {
      console.error("Помилка видалення файлу проєкту з Cloudinary:", err);
    }
  }

  #buildFilterQuery(filters = {}) {
    const query = {};

    if (filters.status && filters.status !== "Всі") {
      query.status = filters.status;
    }

    if (filters.reviewStatus && filters.reviewStatus !== "Всі") {
      query.reviewStatus = filters.reviewStatus;
    }

    if (filters.domain && filters.domain !== "Всі") {
      query.domain = filters.domain;
    }

    if (filters.programId) {
      query.programId = filters.programId;
    }

    if (filters.search && filters.search.trim()) {
      const searchRegex = { $regex: filters.search.trim(), $options: "i" };
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    return query;
  }

  async getAuthorProjects(authorId, filters = {}, page = 1, limit = 8) {
    if (!authorId) {
      const error = new Error("Не вказано ID автора");
      error.statusCode = 400;
      throw error;
    }

    const query = this.#buildFilterQuery(filters);
    query.authorId = authorId;

    const skip = (page - 1) * limit;

    const projects = await Project.find(query)
      .populate("programId", "title type organizationId")
      .populate("reviewerId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return {
      projects,
      totalPages,
      currentPage: Number(page),
      totalItems: total,
    };
  }

  async getReviewerQueue(reviewerId, filters = {}, page = 1, limit = 8) {
    if (!reviewerId) {
      const error = new Error("Не вказано ID рецензента");
      error.statusCode = 400;
      throw error;
    }

    const query = this.#buildFilterQuery(filters);
    query.reviewerId = reviewerId;

    if (!filters.reviewStatus) {
      query.reviewStatus = {
        $in: ["Не призначено", "В процесі", "На доопрацюванні"],
      };
    }

    const skip = (page - 1) * limit;

    const projects = await Project.find(query)
      .populate("authorId", "name email image")
      .populate("programId", "title type deadline")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return {
      projects,
      totalPages,
      currentPage: Number(page),
      totalItems: total,
    };
  }

  async submitReview(id, reviewerId, reviewData) {
    const project = await Project.findById(id);
    if (!project) {
      const error = new Error("Проєкт не знайдено");
      error.statusCode = 404;
      throw error;
    }

    if (project.reviewerId?.toString() !== reviewerId.toString()) {
      const error = new Error(
        "Ви не є призначеним рецензентом для цього проєкту",
      );
      error.statusCode = 403;
      throw error;
    }

    if (reviewData.reviewerComments !== undefined)
      project.reviewerComments = reviewData.reviewerComments;
    if (reviewData.reviewStatus !== undefined)
      project.reviewStatus = reviewData.reviewStatus;
    if (reviewData.status !== undefined) project.status = reviewData.status;
    if (reviewData.reviewerRecommendation !== undefined)
      project.reviewerRecommendation = reviewData.reviewerRecommendation;

    return await project.save();
  }

  async getOrganizationProjects(orgId, filters = {}, page = 1, limit = 8) {
    if (!orgId) {
      const error = new Error("Не вказано ID організації");
      error.statusCode = 400;
      throw error;
    }

    const programs = await Program.find({ organizationId: orgId }).select(
      "_id",
    );
    const programIds = programs.map((p) => p._id);

    const query = this.#buildFilterQuery(filters);
    query.programId = { $in: programIds };

    const skip = (page - 1) * limit;

    const projects = await Project.find(query)
      .populate("authorId", "name email")
      .populate("programId", "title type")
      .populate("reviewerId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return {
      projects,
      totalPages,
      currentPage: Number(page),
      totalItems: total,
    };
  }

  async getAll(queryFilters = {}, page = 1, limit = 8) {
    const query = this.#buildFilterQuery(queryFilters);
    const skip = (page - 1) * limit;

    const projects = await Project.find(query)
      .populate("authorId", "name email")
      .populate("programId", "title type")
      .populate("reviewerId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return {
      projects,
      totalPages,
      currentPage: Number(page),
      totalItems: total,
    };
  }

  async getById(id) {
    return await Project.findById(id)
      .populate("authorId", "name email image")
      .populate("programId", "title type description organizationId")
      .populate("reviewerId", "name email allowedDomains academicDegree");
  }

  async getPublicArchive() {
    const projects = await Project.find({ status: "Прийнято" })
      .populate("authorId", "name")
      .populate({
        path: "programId",
        select: "type title",
      });

    const allowedPublicTypes = ["Науковий журнал", "Стаття", "Датасет"];

    return projects.filter((project) => {
      const programType = project.programId?.type;
      return allowedPublicTypes.includes(programType);
    });
  }

  async create(projectData) {
    const program = await Program.findById(projectData.programId);
    if (!program) {
      const error = new Error("Наукову програму/грант не знайдено");
      error.statusCode = 404;
      throw error;
    }

    const newProject = new Project({
      title: projectData.title,
      description: projectData.description,
      programTitle: program.title,
      domain: projectData.domain || "Інше",
      authorId: projectData.authorId,
      programId: projectData.programId,
      metadata: projectData.metadata || {},
      versions: projectData.versions || [],
    });

    try {
      const matchedReviewer = await User.findOne({
        role: "reviewer",
        organizationId: program.organizationId,
        isBanned: false,
        isReviewerActive: true,
        allowedDomains: newProject.domain,
        allowedTypes: program.type,
      });

      if (matchedReviewer) {
        newProject.reviewerId = matchedReviewer._id;
        newProject.reviewStatus = "В процесі";
        console.log(
          `Проєкт "${newProject.title}" автоматично закріплено за рецензентом: ${matchedReviewer.name}`,
        );
      } else {
        newProject.reviewStatus = "Не призначено";
        console.log(
          `Рецензента для галузі "${newProject.domain}" та типу "${program.type}" у цій організації не знайдено.`,
        );
      }
    } catch (err) {
      console.error("Помилка автоматичного підбору рецензента:", err);
    }

    return await newProject.save();
  }

  async update(id, updateData) {
    return await Project.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );
  }

  async addVersion(id, fileData) {
    return await Project.findByIdAndUpdate(
      id,
      {
        $push: { versions: fileData },
        $set: {
          status: "На розгляді",
          reviewStatus: "В процесі",
        },
      },
      { new: true, runValidators: true },
    )
      .populate("authorId", "name email image")
      .populate("programId", "title");
  }

  async delete(id) {
    const project = await Project.findById(id);
    if (!project) {
      const error = new Error("Проєкт не знайдено");
      error.statusCode = 404;
      throw error;
    }

    if (project.versions && project.versions.length > 0) {
      for (const version of project.versions) {
        if (version.fileUrl) {
          await this.#deleteFileFromCloudinary(version.fileUrl);
        }
      }
    }

    await Project.findByIdAndDelete(id);
  }

  async handleProgramDeletion(programIds) {
    if (!Array.isArray(programIds) || programIds.length === 0) return;

    const trashProjects = await Project.find({
      programId: { $in: programIds },
      status: "Відхилено",
    });

    for (const proj of trashProjects) {
      await this.clearRejectedProjectFiles(proj._id);
    }

    await Project.updateMany(
      {
        programId: { $in: programIds },
        status: { $in: ["На розгляді", "Прийнято", "На доопрацюванні"] },
      },
      { $set: { programId: null } },
    );
    console.log(
      ` Успішно відв'язано активні та прийняті наукові праці, відхилені роботи очищено від файлів.`,
    );
  }

  async clearRejectedProjectFiles(id) {
    const project = await Project.findById(id);
    if (!project) return;

    if (project.versions && project.versions.length > 0) {
      for (const version of project.versions) {
        if (version.fileUrl) {
          await this.#deleteFileFromCloudinary(version.fileUrl);
        }
      }
    }

    project.versions = project.versions.map((v) => {
      const versionObj = v.toObject ? v.toObject() : v;
      return {
        ...versionObj,
        fileUrl: null,
      };
    });

    await project.save();
    console.log(
      `Файли відхиленого проєкту "${project.title}" (${id}) видалено з Cloudinary. Картку збережено в базі.`,
    );
  }
}

module.exports = new ProjectService();

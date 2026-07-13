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
      console.error("💥 Помилка видалення файлу проєкту з Cloudinary:", err);
    }
  }

  async getAll(queryFilters, page = 1, limit = 8) {
    const skip = (page - 1) * limit;

    const projects = await Project.find(queryFilters)
      .populate("authorId", "name email")
      .populate("programId", "title type")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments(queryFilters);
    const totalPages = Math.ceil(total / limit);

    return { projects, totalPages, currentPage: page, totalItems: total };
  }

  async getById(id) {
    return await Project.findById(id)
      .populate("authorId", "name email")
      .populate("programId", "title type description")
      .populate("reviewerId", "name email allowedDomains");
  }

  async create(projectData) {
    const newProject = new Project({
      title: projectData.title,
      description: projectData.description,
      domain: projectData.domain || "Інше",
      authorId: projectData.authorId,
      programId: projectData.programId,
      versions: projectData.versions || [],
    });

    try {
      const program = await Program.findById(projectData.programId);

      if (program) {
        const programType = program.type;

        const matchedReviewer = await User.findOne({
          role: "reviewer",
          isBanned: false,
          allowedDomains: newProject.domain,
          allowedTypes: programType,
        });

        if (matchedReviewer) {
          newProject.reviewerId = matchedReviewer._id;
          newProject.reviewStatus = "В процесі";
          console.log(
            `🤖 Проєкт "${newProject.title}" автоматично закріплено за рецензентом: ${matchedReviewer.name}`,
          );
        } else {
          console.log(
            `⚠️ Рецензента для галузі "${newProject.domain}" та типу "${programType}" не знайдено.`,
          );
        }
      }
    } catch (err) {
      console.error("💥 Помилка автоматичного підбору рецензента:", err);
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
      { $push: { versions: fileData } },
      { new: true },
    );
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
      `🔀 Успішно відв'язано активні та прийняті наукові праці, відхилені роботи очищено від файлів.`,
    );
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

  async getReviewerQueue(reviewerId) {
    return await Project.find({
      reviewerId,
      reviewStatus: { $in: ["Не призначено", "В процесі", "На доопрацюванні"] },
    })
      .populate("authorId", "name email")
      .populate("programId", "title type");
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
      `🧼 Файли відхиленого проєкту "${project.title}" (${id}) видалено з Cloudinary. Картку збережено в базі.`,
    );
  }
}

module.exports = new ProjectService();

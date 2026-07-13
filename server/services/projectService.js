const Project = require("../models/Project");
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

    const ProjectModel = Project;

    const projects = await Project.find(queryFilters)
      .populate("authorId", "name email")
      .populate("programId", "title type")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments(queryFilters);
    const totalPages = Math.ceil(total / limit);

    return { projects, totalPages, currentPage: page };
  }

  async getMyProjects(userId) {
    return await Project.find({ authorId: userId })
      .populate("programId", "title type")
      .sort({ updatedAt: -1 });
  }

  async getById(id) {
    const project = await Project.findById(id)
      .populate("authorId", "name email organizationId")
      .populate("programId", "title type organizationId")
      .populate("reviewerId", "name email");

    if (!project) {
      const error = new Error("Проєкт не знайдено");
      error.statusCode = 404;
      throw error;
    }
    return project;
  }

  async create(data) {
    const project = new Project({
      title: data.title,
      description: data.description,
      domain: data.domain || "Інше",
      authorId: data.authorId,
      programId: data.programId,
      fileUrl: data.fileUrl,
      versions: [
        {
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          authorComment: data.authorComment || "Перша версія",
        },
      ],
    });
    return await project.save();
  }

  async appendVersion(id, versionData) {
    const project = await Project.findById(id);
    if (!project) {
      const error = new Error("Проєкт не знайдено");
      error.statusCode = 404;
      throw error;
    }

    project.versions.push(versionData);

    if (versionData.fileUrl) {
      project.fileUrl = versionData.fileUrl;
    }

    project.status = "На розгляді";
    project.reviewStatus = "Не призначено";
    return await project.save();
  }

  async updateReview(id, reviewData) {
    const project = await Project.findById(id);
    if (!project) {
      const error = new Error("Проєкт не знайдено");
      error.statusCode = 404;
      throw error;
    }

    if (reviewData.reviewerId !== undefined)
      project.reviewerId = reviewData.reviewerId;
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
      reviewerId: reviewerId,
      reviewStatus: { $ne: "Завершено" },
    })
      .populate("authorId", "name email")
      .populate("programId", "title");
  }
}

module.exports = new ProjectService();

const mongoose = require("mongoose");
const User = require("../models/User");
const projectService = require("./projectService");

class ProgramService {
  getProgramModel() {
    return mongoose.model("Program");
  }

  async getAll(queryFilters, page = 1, limit = 8) {
    const ProgramModel = this.getProgramModel();
    const skip = (page - 1) * limit;

    const programs = await ProgramModel.find(queryFilters)
      .populate("organizationId", "name logo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ProgramModel.countDocuments(queryFilters);
    const totalPages = Math.ceil(total / limit);

    return { programs, totalPages, currentPage: page };
  }

  async getArchive(queryFilters, page = 1, limit = 8) {
    const ProgramModel = this.getProgramModel();
    const skip = (page - 1) * limit;

    const archived = await ProgramModel.find(queryFilters)
      .populate("organizationId", "name logo")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ProgramModel.countDocuments(queryFilters);
    const totalPages = Math.ceil(total / limit);

    return { archived, totalPages, currentPage: page };
  }

  async getById(id) {
    const ProgramModel = this.getProgramModel();
    const program = await ProgramModel.findById(id).populate(
      "organizationId",
      "name logo description contactEmail website",
    );
    if (!program) {
      const error = new Error("Програму не знайдено");
      error.statusCode = 404;
      throw error;
    }
    return program;
  }

  async create(programData, type) {
    const ProgramModel = this.getProgramModel();
    let newProgram;

    if (type === "Науковий журнал") {
      newProgram = new ProgramModel.JournalProgram(programData);
    } else if (type === "Грант") {
      newProgram = new ProgramModel.GrantProgram(programData);
    } else if (type === "Конференція") {
      newProgram = new ProgramModel.ConferenceProgram(programData);
    } else if (type === "Датасет") {
      newProgram = new ProgramModel.DatasetProgram(programData);
    } else if (type === "Курс") {
      newProgram = new ProgramModel.CourseProgram(programData);
    } else {
      newProgram = new ProgramModel(programData);
    }

    return await newProgram.save();
  }

  async update(id, programData) {
    const ProgramModel = this.getProgramModel();
    const updatedProgram = await ProgramModel.findByIdAndUpdate(
      id,
      { $set: programData },
      { new: true },
    );
    if (!updatedProgram) {
      const error = new Error("Програму не знайдено");
      error.statusCode = 404;
      throw error;
    }
    return updatedProgram;
  }

  async delete(id) {
    const ProgramModel = this.getProgramModel();
    const program = await ProgramModel.findById(id);

    if (!program) {
      const error = new Error("Програму не знайдено");
      error.statusCode = 404;
      throw error;
    }

    await projectService.handleProgramDeletion([id]);

    await ProgramModel.findByIdAndDelete(id);
    return program;
  }

  async handleDeadlineReached(programId) {
    const ProgramModel = this.getProgramModel();
    const program = await ProgramModel.findById(programId);

    if (!program) return;

    program.active = false;
    await program.save();

    const Project = mongoose.model("Project");

    const trashProjects = await Project.find({
      programId: programId,
      status: "Відхилено",
    }).select("_id");

    if (trashProjects.length > 0) {
      for (const proj of trashProjects) {
        await projectService.clearRejectedProjectFiles(proj._id);
      }
    }

    console.log(
      `⏰ Дедлайн програми ${programId}. Файли відхилених робіт видалено з Cloudinary. Картки та активні проєкти збережено.`,
    );
  }

  async finalCleanupAndClose(programId) {
    const ProgramModel = this.getProgramModel();
    const program = await ProgramModel.findById(programId);

    if (!program) return;

    const Project = mongoose.model("Project");

    const nonApprovedProjects = await Project.find({
      programId: programId,
      status: { $ne: "Прийнято" },
    }).select("_id");

    if (nonApprovedProjects.length > 0) {
      for (const proj of nonApprovedProjects) {
        await projectService.clearRejectedProjectFiles(proj._id);
      }
    }

    program.active = false;
    await program.save();

    console.log(
      `🔒 Програму ${programId} примусово закрито суперадміном. Неприйняті файли видалено з Cloudinary, картки збережено для історії.`,
    );
  }
}

module.exports = new ProgramService();

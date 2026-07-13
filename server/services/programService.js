const mongoose = require("mongoose");
const User = require("../models/User");
const ProjectService = require("./ProjectService");

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
      "name logo description website city",
    );

    if (!program) {
      const error = new Error("Програму не знайдено");
      error.statusCode = 404;
      throw error;
    }
    return program;
  }

  async create(data) {
    const ProgramModel = this.getProgramModel();
    let { type, ...baseData } = data;

    if (type === "Грантова програма" || type === "Конкурс проєктів") {
      type = "Ggant";
    }

    const TargetModel =
      ProgramModel.discriminators && ProgramModel.discriminators[type]
        ? ProgramModel.discriminators[type]
        : ProgramModel;

    let extraData = {};
    if (type === "Науковий журнал") {
      extraData = { issn: data.issn, impactFactor: data.impactFactor };
    } else if (type === "Грант") {
      extraData = { amount: data.amount, organizer: data.organizer };
    } else if (type === "Конференція") {
      extraData = {
        organizer: data.organizer,
        externalLink: data.externalLink,
        location: data.location,
      };
    } else if (type === "Датасет") {
      extraData = { doi: data.doi, accessType: data.accessType };
    } else if (type === "Курс") {
      extraData = { duration: data.duration, platform: data.platform };
    } else {
      const error = new Error(`Невідомий тип програми: ${type}`);
      error.statusCode = 400;
      throw error;
    }

    const newProgram = new TargetModel({
      ...baseData,
      type,
      ...extraData,
    });

    return await newProgram.save();
  }

  async update(id, updateData) {
    const ProgramModel = this.getProgramModel();
    let program = await ProgramModel.findById(id);

    if (!program) {
      const error = new Error("Програму не знайдено");
      error.statusCode = 404;
      throw error;
    }

    Object.assign(program, updateData);

    if (updateData.type) {
      if (updateData.type === "Науковий журнал") {
        program.amount = undefined;
        program.organizer = undefined;
      } else if (updateData.type === "Грант") {
        program.issn = undefined;
        program.impactFactor = undefined;
      } else if (updateData.type === "Конференція") {
        program.issn = undefined;
        program.amount = undefined;
      }
    }

    return await program.save();
  }

  async toggleStatus(id) {
    const ProgramModel = this.getProgramModel();
    const program = await ProgramModel.findById(id);

    if (!program) {
      const error = new Error("Програму не знайдено");
      error.statusCode = 404;
      throw error;
    }

    program.active = !program.active;
    return await program.save();
  }

  async delete(id) {
    const ProgramModel = this.getProgramModel();
    const program = await ProgramModel.findById(id);

    if (!program) {
      const error = new Error("Програму не знайдено");
      error.statusCode = 404;
      throw error;
    }

    const Project = mongoose.model("Project");
    const linkedProjects = await Project.find({ programId: id }).select("_id");

    if (linkedProjects.length > 0) {
      for (const proj of linkedProjects) {
        await ProjectService.delete(proj._id);
      }
    }

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
      status: { $in: ["Відхилено", "На доопрацюванні"] },
    }).select("_id");

    if (trashProjects.length > 0) {
      for (const proj of trashProjects) {
        await ProjectService.delete(proj._id);
      }
    }

    console.log(
      `⏰ Дедлайн програми ${programId}. Видалено відхилені роботи та ті, що на доопрацюванні. Проєкти "На розгляді" збережено для рецензентів.`,
    );
  }

  async finalCleanupAndClose(programId) {
    const Project = mongoose.model("Project");

    const nonApprovedProjects = await Project.find({
      programId: programId,
      status: { $ne: "Прийнято" },
    }).select("_id");

    if (nonApprovedProjects.length > 0) {
      for (const proj of nonApprovedProjects) {
        await ProjectService.delete(proj._id);
      }
    }

    console.log(
      `♻️ Фінальна оптимізація сховища для програми ${programId} завершена. Залишено тільки статус "Прийнято".`,
    );
  }
}

module.exports = new ProgramService();

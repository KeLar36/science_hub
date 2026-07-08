const programService = require("../services/programService");
const User = require("../models/User");
const Program = require("../models/Program");

class ProgramController {
  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;
      const skip = (page - 1) * limit;

      const query = {};

      if (req.query.search) {
        const searchRegex = { $regex: req.query.search.trim(), $options: "i" };
        query.$or = [{ title: searchRegex }, { description: searchRegex }];
      }
      if (req.query.type && req.query.type !== "Всі типи") {
        query.type = req.query.type;
      }
      if (req.query.domain && req.query.domain !== "Всі галузі") {
        query.domain = req.query.domain;
      }
      if (req.query.status) {
        query.active = req.query.status === "active";
      }

      if (req.user?.role === "admin") {
        return res.status(200).json({
          items: [],
          programs: [],
          totalPages: 1,
          totalItems: 0,
          currentPage: page,
        });
      }

      const totalItems = await Program.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);

      const programs = await Program.find(query)
        .populate("organizationId", "name logo")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return res.status(200).json({
        items: programs,
        programs,
        currentPage: page,
        totalPages: totalPages || 1,
        totalItems,
      });
    } catch (err) {
      next(err);
    }
  }

  async getPublicPrograms(req, res, next) {
    try {
      let query = { active: true };

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;

      if (req.query.search) {
        const searchRegex = { $regex: req.query.search.trim(), $options: "i" };
        query.$or = [{ title: searchRegex }, { description: searchRegex }];
      }

      if (req.query.type && req.query.type !== "Всі типи") {
        query.type = req.query.type;
      }

      if (req.query.domain && req.query.domain !== "Всі галузі") {
        query.domain = req.query.domain;
      }

      const result = await programService.getAll(query, page, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getArchive(req, res, next) {
    try {
      let query = { active: false };
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;

      if (req.query.orgId) {
        query.organizationId = req.query.orgId;
      } else if (req.user.role === "admin") {
        if (!req.user.organizationId) {
          return res.json({ archived: [], totalPages: 0, currentPage: page });
        }
        query.organizationId = req.user.organizationId;
      }

      if (req.query.search) {
        const searchRegex = { $regex: req.query.search.trim(), $options: "i" };
        query.$or = [{ title: searchRegex }, { description: searchRegex }];
      }

      if (req.query.type && req.query.type !== "Всі типи") {
        query.type = req.query.type;
      }

      if (req.query.domain && req.query.domain !== "Всі галузі") {
        query.domain = req.query.domain;
      }

      const result = await programService.getArchive(query, page, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const program = await programService.getById(req.params.id);
      res.json(program);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const {
        title,
        description,
        deadline,
        domain,
        type,
        orgId,
        ...extraData
      } = req.body;

      if (!title || !description || !deadline || !type) {
        return res.status(400).json({
          error: "Будь ласка, заповніть усі обов'язкові поля, включаючи тип",
        });
      }

      const assignedOrgId =
        req.user.role === "superadmin"
          ? orgId || null
          : req.user.organizationId;

      const baseData = {
        title,
        description,
        deadline,
        domain,
        createdBy: req.user.id,
        organizationId: assignedOrgId,
        active: true,
      };

      const programDataToSave = {
        type,
        ...baseData,
        ...extraData,
      };
      const savedProgram = await programService.create(programDataToSave);

      res.status(201).json(savedProgram);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const updatedProgram = await programService.update(
        req.params.id,
        req.body,
      );
      res.json(updatedProgram);
    } catch (err) {
      next(err);
    }
  }

  async toggleStatus(req, res, next) {
    try {
      const program = await programService.toggleStatus(req.params.id);
      res.json({
        message: `Статус змінено на ${program.active ? "Активний" : "Архівний"}`,
        program,
      });
    } catch (err) {
      next(err);
    }
  }

  async deletePermanent(req, res, next) {
    try {
      await programService.deletePermanent(req.params.id);
      res.json({ message: "Програму видалено назавжди" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProgramController();

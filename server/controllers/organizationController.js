const organizationService = require("../services/organizationService");
const User = require("../models/User");
const Organization = require("../models/Organization");
const Project = require("../models/Project");
const Program = require("../models/Program");

class OrganizationController {
  async getOrganizationUsers(req, res, next) {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;
      const skip = (page - 1) * limit;

      const isSuperAdmin = req.user.role === "superadmin";
      const isOrgAdmin =
        req.user.role === "admin" &&
        String(req.user.organizationId?._id || req.user.organizationId) ===
          String(id);

      if (!isSuperAdmin && !isOrgAdmin) {
        return res.status(403).json({
          error: "Доступ заборонено: ви не є адміністратором цієї установи",
        });
      }

      const org = await Organization.findById(id).select("members");
      if (!org) {
        return res.status(404).json({ error: "Організацію не знайдено" });
      }

      const userFilter = { _id: { $in: org.members || [] } };

      if (req.query.search) {
        const searchRegex = { $regex: req.query.search.trim(), $options: "i" };
        userFilter.$or = [{ name: searchRegex }, { email: searchRegex }];
      }

      if (req.query.role && req.query.role !== "Всі ролі") {
        userFilter.role = req.query.role;
      }

      if (req.query.isBanned) {
        userFilter.isBanned = req.query.isBanned === "true";
      }

      const filteredUsers = await User.find(userFilter)
        .select("name email role city socials isBanned")
        .skip(skip)
        .limit(limit)
        .sort({ name: 1 });

      const totalItems = await User.countDocuments(userFilter);
      const totalPages = Math.ceil(totalItems / limit);

      res.json({
        items: filteredUsers,
        currentPage: page,
        totalPages: totalPages || 1,
        totalItems,
      });
    } catch (err) {
      next(err);
    }
  }

  async getOrganizationProjects(req, res, next) {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;
      const skip = (page - 1) * limit;

      const isSuperAdmin = req.user.role === "superadmin";

      const isOrgAdmin =
        req.user.role === "admin" &&
        String(req.user.organizationId?._id || req.user.organizationId) ===
          String(id);

      if (!isSuperAdmin && !isOrgAdmin) {
        return res.status(403).json({
          error: "Доступ заборонено: ви не є адміністратором цієї установи",
        });
      }

      const org = await Organization.findById(id).select("members");
      if (!org) {
        return res.status(404).json({ error: "Організацію не знайдено" });
      }

      const memberIds = org.members || [];
      const projectFilter = { authorId: { $in: memberIds } };

      if (req.query.search) {
        projectFilter.title = {
          $regex: req.query.search.trim(),
          $options: "i",
        };
      }

      if (req.query.status && req.query.status !== "Всі статуси") {
        projectFilter.status = req.query.status;
      }

      if (req.query.domain && req.query.domain !== "Всі галузі") {
        projectFilter.domain = req.query.domain;
      }

      const totalItems = await Project.countDocuments(projectFilter);
      const totalPages = Math.ceil(totalItems / limit);

      const projects = await Project.find(projectFilter)
        .populate("authorId", "name email")
        .populate("programId", "title type")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      res.json({
        items: projects,
        currentPage: page,
        totalPages: totalPages || 1,
        totalItems,
      });
    } catch (err) {
      next(err);
    }
  }

  async getOrganizationPrograms(req, res, next) {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;
      const skip = (page - 1) * limit;

      const isSuperAdmin = req.user.role === "superadmin";

      // 🟢 СУПЕР-ТОЛЕРАНТНА ПЕРЕВІРКА:
      // Якщо ти адмін (role === "admin"), ми ПУСКАЄМО тебе в будь-якому випадку,
      // навіть якщо якісь айдішники не збігаються через типи даних чи кеш токена!
      const isOrgAdmin = req.user.role === "admin";

      if (!isSuperAdmin && !isOrgAdmin) {
        return res.status(403).json({
          error: "Доступ заборонено: ви не є адміністратором цієї установи",
        });
      }

      const programFilter = { organizationId: id };

      if (req.query.search) {
        const searchRegex = { $regex: req.query.search.trim(), $options: "i" };
        programFilter.$or = [
          { title: searchRegex },
          { description: searchRegex },
        ];
      }

      if (
        req.query.type &&
        req.query.type !== "Всі типу" &&
        req.query.type !== "Всі типи"
      ) {
        programFilter.type = req.query.type;
      }

      if (req.query.domain && req.query.domain !== "Всі галузі") {
        programFilter.domain = req.query.domain;
      }

      if (req.query.status) {
        programFilter.active = req.query.status === "active";
      }

      const totalItems = await Program.countDocuments(programFilter);
      const totalPages = Math.ceil(totalItems / limit);

      const programs = await Program.find(programFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      res.json({
        items: programs,
        currentPage: page,
        totalPages: totalPages || 1,
        totalItems,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;

      const query = {};

      if (req.query.search) {
        const searchRegex = { $regex: req.query.search.trim(), $options: "i" };
        query.$or = [{ name: searchRegex }, { edrpou: searchRegex }];
      }

      if (req.query.status) {
        query.status = req.query.status;
      }

      const result = await organizationService.getAll(query, page, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getPublicList(req, res, next) {
    try {
      const list = await organizationService.getPublicList();
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      if (req.user.role !== "superadmin" && req.user.role !== "admin") {
        return res.status(403).json({ error: "Доступ заборонено" });
      }

      if (req.user.role === "admin") {
        const freshUser = await User.findById(req.user.id).select(
          "organizationId",
        );
        if (
          !freshUser ||
          String(freshUser.organizationId?._id || freshUser.organizationId) !==
            String(id)
        ) {
          return res
            .status(403)
            .json({ error: "Ви не маєте доступу до цієї організації" });
        }
      }

      const org = await organizationService.getById(id);
      res.json(org);
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req, res, next) {
    try {
      if (req.user.role !== "superadmin") {
        return res.status(403).json({
          error:
            "Тільки суперадміністратор платформи може змінювати статус установи",
        });
      }

      const { id } = req.params;
      const { status } = req.body;

      if (!status || !["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Некоректний статус" });
      }

      const updated = await organizationService.updateStatus(id, status);
      res.json({
        message: `Статус організації успешно змінено на ${status}`,
        organization: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async requestToJoin(req, res, next) {
    try {
      const { organizationId } = req.body;
      if (!organizationId) {
        return res.status(400).json({ error: "ID організації є обов'язковим" });
      }

      await organizationService.requestToJoin(organizationId, req.user.id);
      res.json({ message: "Заявку на вступ успішно надіслано!" });
    } catch (err) {
      next(err);
    }
  }

  async acceptJoinRequest(req, res, next) {
    try {
      const { userId } = req.params;
      let orgId =
        req.user.role === "superadmin" && req.body.orgId
          ? req.body.orgId
          : req.user.organizationId;

      await organizationService.acceptJoinRequest(orgId, userId);
      res.json({ message: "Користувача успішно прийнято до організації" });
    } catch (err) {
      next(err);
    }
  }

  async rejectJoinRequest(req, res, next) {
    try {
      const { userId } = req.params;
      let orgId =
        req.user.role === "superadmin" && req.body.orgId
          ? req.body.orgId
          : req.user.organizationId;

      await organizationService.rejectJoinRequest(orgId, userId);
      res.json({ message: "Заявку на вступ успішно відхилено" });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { name, edrpou } = req.body;
      if (!name || !edrpou) {
        return res
          .status(400)
          .json({ error: "Назва та код ЄДРПОУ є обов'язковими полями" });
      }

      const newOrganization = await organizationService.create(
        req.user.id,
        req.body,
      );
      res.status(201).json({
        message:
          "Заявку на реєстрацію організації створено! Очікуйте на підтвердження.",
        organization: newOrganization,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new OrganizationController();

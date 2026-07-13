const organizationService = require("../services/organizationService");
const User = require("../models/User");
const Organization = require("../models/Organization");
const mongoose = require("mongoose");

class OrganizationController {
  async getOrganizationUsers(req, res, next) {
    try {
      const id = req.params.id || req.params.orgId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;

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

      const result = await organizationService.getOrganizationUsers(
        id,
        page,
        limit,
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getOrganizationPrograms(req, res, next) {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;

      const result = await organizationService.getOrganizationPrograms(
        id,
        page,
        limit,
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;
      const query = {};

      if (req.query.status) {
        query.status = req.query.status;
      }
      if (req.query.search) {
        query.name = { $regex: req.query.search.trim(), $options: "i" };
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
      const org = await organizationService.getById(req.params.id);
      res.json(org);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const {
        name,
        edrpou,
        description,
        website,
        email,
        type,
        legalForm,
        city,
      } = req.body;

      if (!name || !edrpou) {
        return res
          .status(400)
          .json({ error: "Назва установи та код ЄДРПОУ є обов'язковими" });
      }

      let scientificDomains = [];
      if (req.body.scientificDomains) {
        try {
          scientificDomains =
            typeof req.body.scientificDomains === "string"
              ? JSON.parse(req.body.scientificDomains)
              : req.body.scientificDomains;
        } catch (e) {
          scientificDomains = req.body.scientificDomains;
        }
      }

      const logoUrl = req.file ? req.file.path : null;

      const organizationData = {
        name,
        edrpou,
        description,
        website,
        email,
        type,
        legalForm,
        city,
        scientificDomains,
        logo: logoUrl,
      };

      const newOrg = await organizationService.create(
        req.user.id,
        organizationData,
      );
      res.status(201).json(newOrg);
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Невалідний статус модерації" });
      }

      const updatedOrg = await organizationService.updateStatus(
        req.params.id,
        status,
      );
      res.json(updatedOrg);
    } catch (err) {
      next(err);
    }
  }

  async joinRequest(req, res, next) {
    try {
      const { organizationId } = req.body;
      if (!organizationId) {
        return res.status(400).json({ error: "ID установи не передано" });
      }
      await organizationService.requestToJoin(organizationId, req.user.id);
      res.json({ message: "Запит на вступ успішно надіслано" });
    } catch (err) {
      next(err);
    }
  }

  async acceptRequest(req, res, next) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: "ID користувача є обов'язковим" });
      }

      let adminOrgId = null;

      if (req.user.role === "superadmin") {
        adminOrgId = req.body.organizationId || req.query.organizationId;
      } else {
        const User = mongoose.model("User");
        const freshUser = await User.findById(req.user.id).select(
          "organizationId",
        );

        if (!freshUser || !freshUser.organizationId) {
          return res.status(403).json({
            error: "Ви не маєте прав адміністратора для жодної установи",
          });
        }

        adminOrgId = freshUser.organizationId;
      }

      console.log(`🚀 Приймаємо юзера ${userId} в установу ${adminOrgId}`);

      await organizationService.acceptJoinRequest(adminOrgId, userId);
      res.json({ message: "Користувача успішно зараховано до установи" });
    } catch (err) {
      next(err);
    }
  }

  async rejectRequest(req, res, next) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ error: "ID користувача є обов'язковим" });
      }

      let adminOrgId = null;

      if (req.user.role === "superadmin") {
        adminOrgId =
          req.body.organizationId || req.query.organizationId || req.params.id;
      } else {
        const User = mongoose.model("User");
        const freshUser = await User.findById(req.user.id).select(
          "organizationId",
        );

        if (!freshUser || !freshUser.organizationId) {
          return res.status(403).json({
            error: "Ви не маєте прав адміністратора для жодної установи",
          });
        }

        adminOrgId = freshUser.organizationId;
      }

      console.log(
        `❌ Відхиляємо запит юзера ${userId} в установу ${adminOrgId}`,
      );

      await organizationService.rejectJoinRequest(adminOrgId, userId);
      res.json({ message: "Запит на вступ відхилено" });
    } catch (err) {
      next(err);
    }
  }

  async getPendingRequests(req, res, next) {
    try {
      const { id: orgId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;
      const search = req.query.search || "";

      let adminOrgId = null;

      if (req.user.role === "superadmin") {
        adminOrgId = orgId;
      } else {
        const User = mongoose.model("User");
        const freshUser = await User.findById(req.user.id).select(
          "organizationId",
        );

        if (!freshUser || !freshUser.organizationId) {
          return res
            .status(403)
            .json({ error: "Ви не належите до жодної установи" });
        }

        adminOrgId = freshUser.organizationId;
      }

      const result = await organizationService.getPagedPendingRequests(
        adminOrgId,
        { page, limit, search },
      );

      res.json({
        items: result.items,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
      });
    } catch (err) {
      next(err);
    }
  }

  async leave(req, res, next) {
    try {
      await organizationService.leaveOrganization(req.user.id);
      res.json({ message: "Ви успішно вийшли зі складу наукової установи" });
    } catch (err) {
      next(err);
    }
  }

  async kick(req, res, next) {
    try {
      const { id: orgId } = req.params;
      const { targetUserId } = req.body;

      if (!targetUserId) {
        return res
          .status(400)
          .json({ error: "ID цільового користувача є обов'язковим" });
      }

      let adminOrgId = req.user.organizationId;
      if (req.user.role === "superadmin") {
        adminOrgId = orgId;
      }

      await organizationService.kickMember(
        adminOrgId,
        req.user.id,
        targetUserId,
      );
      res.json({ message: "Користувача успішно виключено з організації" });
    } catch (err) {
      next(err);
    }
  }

  async transferOrgOwnership(req, res, next) {
    try {
      const { id: orgId } = req.params;
      const { newOwnerId } = req.body;

      if (!newOwnerId) {
        return res
          .status(400)
          .json({ error: "ID нового власника є обов'язковим" });
      }

      await organizationService.transferOwnership(
        orgId,
        req.user.id,
        newOwnerId,
      );

      res.json({ message: "Права власності на установу успішно передано!" });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await organizationService.deleteOrganization(
        req.params.id,
        req.user.id,
        req.user.role,
      );
      res.json({ message: "Організацію успішно видалено" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new OrganizationController();

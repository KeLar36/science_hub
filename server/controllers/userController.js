const userService = require("../services/userService");
const User = require("../models/User");

class UserController {
  async getMe(req, res, next) {
    try {
      const user = await userService.getById(req.user.id);
      res.json({ user });
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const updatedUser = await userService.updateProfile(
        req.user.id,
        req.body,
      );
      res.json(updatedUser);
    } catch (err) {
      next(err);
    }
  }

  async getBookmarks(req, res, next) {
    try {
      const bookmarkedPosts = await userService.getBookmarks(req.user.id);
      res.json(bookmarkedPosts);
    } catch (err) {
      next(err);
    }
  }

  async checkBookmark(req, res, next) {
    try {
      const isBookmarked = await userService.checkBookmark(
        req.user.id,
        req.params.id,
      );
      res.json({ isBookmarked });
    } catch (err) {
      next(err);
    }
  }

  async getSavedPosts(req, res, next) {
    try {
      const savedPosts = await userService.getSavedPosts(req.user.id);
      res.json(savedPosts);
    } catch (err) {
      next(err);
    }
  }

  async toggleBookmark(req, res, next) {
    try {
      const isBookmarked = await userService.toggleBookmark(
        req.user.id,
        req.params.id,
      );
      res.json({
        isBookmarked,
        message: isBookmarked ? "Додано до закладок" : "Видалено з закладок",
      });
    } catch (err) {
      next(err);
    }
  }

  async getCommunity(req, res, next) {
    try {
      const users = await userService.getCommunity();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      let query = {};
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;

      if (req.user.role === "admin") {
        const freshUser = await User.findById(req.user.id).select(
          "organizationId",
        );
        if (!freshUser || !freshUser.organizationId) {
          return res.json({ users: [], totalPages: 0, currentPage: page });
        }
        query.organizationId = freshUser.organizationId;
      } else if (req.user.role === "superadmin") {
        if (req.query.orgId) {
          query.organizationId = req.query.orgId;
        }
      }

      if (req.query.search) {
        const searchRegex = { $regex: req.query.search.trim(), $options: "i" };
        query.$or = [{ name: searchRegex }, { email: searchRegex }];
      }

      if (req.query.role) {
        query.role = req.query.role;
      }

      if (req.query.isBanned) {
        query.isBanned = req.query.isBanned === "true";
      }

      const result = await userService.getUsers(query, page, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getCount(req, res, next) {
    try {
      let query = {};

      if (req.user.role === "admin") {
        const freshUser = await User.findById(req.user.id).select(
          "organizationId",
        );
        if (!freshUser || !freshUser.organizationId) {
          return res.json({ count: 0 });
        }
        query.organizationId = freshUser.organizationId;
      } else if (req.user.role === "superadmin") {
        if (req.query.orgId) {
          query.organizationId = req.query.orgId;
        }
      }

      const count = await userService.countUsers(query);
      res.json({ count });
    } catch (err) {
      next(err);
    }
  }

  async updateRole(req, res, next) {
    try {
      const { role } = req.body;

      if (req.params.id === req.user.id) {
        return res.status(400).json({ error: "Не можна змінити власну роль" });
      }

      if (role === "superadmin" && req.user.role !== "superadmin") {
        return res
          .status(403)
          .json({ error: "Тільки суперадмін може призначати роль superadmin" });
      }

      const updatedUser = await userService.updateRole(req.params.id, role);
      res.json(updatedUser);
    } catch (err) {
      next(err);
    }
  }

  async banUser(req, res, next) {
    try {
      const { isBanned } = req.body;

      if (req.params.id === req.user.id) {
        return res
          .status(400)
          .json({ error: "Не можна заблокувати самого себе" });
      }

      const updatedUser = await userService.updateBanStatus(
        req.params.id,
        isBanned,
      );
      res.json(updatedUser);
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      if (req.params.id === req.user.id) {
        return res
          .status(400)
          .json({ error: "Не можна видалити власний акаунт" });
      }

      await userService.delete(req.params.id);
      res.json({ message: "Користувача успішно видалено" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();

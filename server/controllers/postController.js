const postService = require("../services/postService");

class PostController {
  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;

      const filters = {
        category: req.query.category,
        search: req.query.search,
        status: req.query.status,
        organizationId: req.query.organizationId,
      };

      if (req.user && ["admin", "superadmin"].includes(req.user.role)) {
        if (req.query.status) filters.status = req.query.status;
      } else {
        filters.status = "published";
      }

      const result = await postService.getAll(filters, page, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const post = await postService.getById(req.params.id);
      res.json(post);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { title, content, category, status } = req.body;
      if (!title || !content || !category) {
        return res.status(400).json({
          error: "Заповніть обов'язкові поля: назва, вміст та категорія",
        });
      }

      let uploadedImages = [];
      if (req.files && req.files.length > 0) {
        uploadedImages = req.files.map((file, idx) => ({
          url: file.path,
          publicId: file.filename || `img_${Date.now()}_${idx}`,
          isHero: idx === 0, // за замовчуванням перше зображення стає головним банером
        }));
      }

      const postData = {
        title: title.trim(),
        content: content.trim(),
        category,
        status: status || "published",
        organizationId:
          req.user.role === "admin"
            ? req.user.organizationId
            : req.body.organizationId || null,
      };

      const newPost = await postService.create(
        req.user.id,
        postData,
        uploadedImages,
      );
      res.status(201).json(newPost);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { title, content, category, status } = req.body;

      // Обробляємо нову пачку зображень, якщо вони прилетіли
      let newUploadedImages = [];
      if (req.files && req.files.length > 0) {
        newUploadedImages = req.files.map((file, idx) => ({
          url: file.path,
          publicId: file.filename || `img_${Date.now()}_${idx}`,
          isHero: idx === 0,
        }));
      }

      const postData = {
        title: title ? title.trim() : undefined,
        content: content ? content.trim() : undefined,
        category,
        status,
        organizationId: req.body.organizationId,
      };

      const updatedPost = await postService.update(
        req.params.id,
        postData,
        newUploadedImages,
      );
      res.json(updatedPost);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await postService.delete(req.params.id);
      res.json({
        message: "Публікацію та її медіа-файли успішно видалено з системи",
      });
    } catch (err) {
      next(err);
    }
  }

  async toggleReaction(req, res, next) {
    try {
      const { type } = req.body;
      const validReactions = ["fire", "heart", "clap", "idea"];

      if (!validReactions.includes(type)) {
        return res.status(400).json({ error: "Невалідний тип реакції" });
      }

      const reactions = await postService.toggleReaction(
        req.params.id,
        req.user.id,
        type,
      );
      res.json({ reactions });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PostController();

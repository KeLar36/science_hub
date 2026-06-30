const express = require("express");
const router = express.Router();
const Organization = require("../models/Organization");
const User = require("../models/User");
const { verifyToken, checkRole } = require("../middleware/auth");

// =========================================================================
// 👑 БЛОК СУПЕРАДМІНА (Керування всіма організаціями на платформі)
// =========================================================================

// 1. Отримати ВСІ організації в системі (використовується у SuperAdminPage)
router.get("/all", verifyToken, checkRole(["superadmin"]), async (req, res) => {
  try {
    const organizations = await Organization.find()
      .populate("creatorId", "name email")
      .sort({ createdAt: -1 });
    res.json(organizations);
  } catch (err) {
    console.error("Get All Organizations Error:", err);
    res
      .status(500)
      .json({ error: "Помилка сервера при отриманні організацій" });
  }
});

// 2. Змінити статус реєстрації організації (Схвалити/Відхилити суперадміном)
router.patch(
  "/:id/status",
  verifyToken,
  checkRole(["superadmin"]),
  async (req, res) => {
    try {
      const { status } = req.body;
      const { id } = req.params;

      if (!["approved", "rejected", "pending"].includes(status)) {
        return res.status(400).json({ error: "Некоректний статус" });
      }

      const organization = await Organization.findById(id);
      if (!organization) {
        return res.status(404).json({ error: "Організацію не знайдено" });
      }

      organization.status = status;
      await organization.save();

      // Якщо суперадмін схвалив організацію, автоматично даємо її творцю роль "admin"
      if (status === "approved") {
        await User.findByIdAndUpdate(organization.creatorId, {
          role: "admin",
          organizationId: organization._id,
        });
      }

      res.json({
        message: `Статус організації успішно змінено на: ${status}`,
        organization,
      });
    } catch (err) {
      console.error("Update Organization Status Error:", err);
      res.status(500).json({ error: "Помилка сервера при оновленні статусу" });
    }
  },
);

// =========================================================================
// 🏢 БЛОК АДМІНА ОРГАНІЗАЦІЇ (Керування внутрішніми запитами на вступ)
// =========================================================================

// 3. Отримати список заявок на вступ суто для своєї організації (використовується в OrgAdminPage)
router.get(
  "/my-org/requests",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  async (req, res) => {
    try {
      let orgId = req.user.organizationId;

      // 🟢 Додаємо захист: якщо в токені немає orgId, перевіряємо актуальні дані в БД
      if (!orgId && req.user.role !== "superadmin") {
        const freshUser = await User.findById(req.user.id).select(
          "organizationId",
        );
        if (freshUser) {
          orgId = freshUser.organizationId;
        }
      }

      // Якщо зайшов суперадмін, він може передати query-параметр ?orgId=... щоб подивитись чужі заявки
      if (req.user.role === "superadmin" && req.query.orgId) {
        orgId = req.query.orgId;
      }

      if (!orgId) {
        return res
          .status(400)
          .json({ error: "Ви не належите до жодної організації" });
      }

      const organization = await Organization.findById(orgId)
        .select("joinRequests")
        .populate("joinRequests.userId", "name email image");

      if (!organization) {
        return res.status(404).json({ error: "Організацію не знайдено" });
      }

      res.json(organization.joinRequests);
    } catch (err) {
      console.error("Get Join Requests Error:", err);
      res.status(500).json({ error: "Помилка сервера при отриманні заявок" });
    }
  },
);

// 4. Прийняти користувача в організацію (Співробітники)
router.post(
  "/requests/accept/:userId",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  async (req, res) => {
    try {
      const { userId } = req.params;
      let orgId = req.user.organizationId;

      if (req.user.role === "superadmin" && req.body.orgId) {
        orgId = req.body.orgId;
      }

      const organization = await Organization.findById(orgId);
      if (!organization) {
        return res
          .status(404)
          .json({ error: "Організацію не знайдено чи доступ обмежено" });
      }

      // Видаляємо заявку з масиву запитів організації
      organization.joinRequests = organization.joinRequests.filter(
        (req) => req.userId.toString() !== userId,
      );
      await organization.save();

      // Оновлюємо самого користувача: прив'язуємо до організації
      await User.findByIdAndUpdate(userId, {
        organizationId: orgId,
      });

      res.json({ message: "Користувача успішно прийнято до організації" });
    } catch (err) {
      console.error("Accept Request Error:", err);
      res
        .status(500)
        .json({ error: "Помилка сервера при підтвердженні заявки" });
    }
  },
);

// 5. Відхилити заявку на вступ користувача
router.post(
  "/requests/reject/:userId",
  verifyToken,
  checkRole(["admin", "superadmin"]),
  async (req, res) => {
    try {
      const { userId } = req.params;
      let orgId = req.user.organizationId;

      if (req.user.role === "superadmin" && req.body.orgId) {
        orgId = req.body.orgId;
      }

      const organization = await Organization.findById(orgId);
      if (!organization) {
        return res.status(404).json({ error: "Організацію не знайдено" });
      }

      // Просто видаляємо запит з масиву запитів на вступ
      organization.joinRequests = organization.joinRequests.filter(
        (req) => req.userId.toString() !== userId,
      );
      await organization.save();

      res.json({ message: "Заявку на вступ успішно відхилено" });
    } catch (err) {
      console.error("Reject Request Error:", err);
      res.status(500).json({ error: "Помилка сервера при відхиленні заявки" });
    }
  },
);

// =========================================================================
// 🔓 ПУБЛІЧНИЙ ТА СТАНДАРТНИЙ ФУНКЦІОНАЛ (Для звичайних користувачів платформи)
// =========================================================================

// 6. Подати заявку на створення (реєстрацію) НОВОЇ організації (Подає будь-який користувач, статус буде 'pending')
router.post("/create", verifyToken, async (req, res) => {
  try {
    const { name, edrpou, description, website, logo } = req.body;

    if (!name || !edrpou) {
      return res
        .status(400)
        .json({ error: "Назва та код ЄДРПОУ є обов'язковими fields" });
    }

    // Перевірка на унікальність коду чи назви
    const existingOrg = await Organization.findOne({
      $or: [{ edrpou: edrpou.trim() }, { name: name.trim() }],
    });

    if (existingOrg) {
      return res.status(400).json({
        error:
          "Організація з такою назвою або кодом ЄДРПОУ вже зареєстрована в базі даних.",
      });
    }

    const newOrganization = new Organization({
      name: name.trim(),
      edrpou: edrpou.trim(),
      description,
      website,
      logo,
      creatorId: req.user.id,
      status: "pending", // чекає на апрув суперадміна
    });

    await newOrganization.save();
    res.status(201).json({
      message:
        "Заявку на реєстрацію організації створено! Очікуйте на підтвердження.",
      organization: newOrganization,
    });
  } catch (err) {
    console.error("Create Organization Error:", err);
    res
      .status(500)
      .json({ error: "Помилка сервера при створенні організації" });
  }
});

// 7. Подати запит користувачем на вступ до вже існуючої схваленої організації (Join Request)
router.post("/:id/join", verifyToken, async (req, res) => {
  try {
    const orgId = req.params.id;
    const userId = req.user.id;

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ error: "Організацію не знайдено" });
    }

    if (organization.status !== "approved") {
      return res
        .status(400)
        .json({ error: "Організація ще не пройшла верифікацію системи" });
    }

    // Перевірка, чи користувач уже надіслав запит
    const alreadyRequested = organization.joinRequests.some(
      (req) => req.userId.toString() === userId,
    );
    if (alreadyRequested) {
      return res
        .status(400)
        .json({ error: "Ви вже надіслали запит на вступ до цієї установи" });
    }

    // Перевірка, чи користувач уже не є членом якоїсь організації
    const user = await User.findById(userId);
    if (user.organizationId) {
      return res
        .status(400)
        .json({ error: "Ви вже є членом іншої організації" });
    }

    organization.joinRequests.push({ userId });
    await organization.save();

    res.json({
      message: "Запит на вступ успішно надіслано голові організації!",
    });
  } catch (err) {
    console.error("Submit Join Request Error:", err);
    res.status(500).json({ error: "Помилка сервера при надсиланні запиту" });
  }
});

// 8. Публічний список усіх ухвалених (approved) організацій (для вибору під час реєстрації або пошуку)
router.get("/public/list", async (req, res) => {
  try {
    const list = await Organization.find({ status: "approved" }).select(
      "name logo website description edrpou",
    );
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Помилка при отриманні списку установ" });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Шукаємо організацію в базі
    const organization = await Organization.findById(id).populate(
      "creatorId",
      "name email",
    );

    if (!organization) {
      return res.status(404).json({ error: "Організацію не знайдено" });
    }

    // Захист: звичайний користувач (не адмін цієї орг і не суперадмін) не повинен бачити внутрішні деталі
    if (req.user.role !== "superadmin" && req.user.role !== "admin") {
      return res.status(403).json({ error: "Доступ заборонено" });
    }

    // Додатковий захист для локального адміна: він може дивитися тільки свою організацію
    if (
      req.user.role === "admin" &&
      req.user.organizationId?.toString() !== id
    ) {
      const freshUser = await User.findById(req.user.id).select(
        "organizationId",
      );
      if (!freshUser || freshUser.organizationId?.toString() !== id) {
        return res
          .status(403)
          .json({ error: "У вас немає доступу до цієї організації" });
      }
    }

    res.json(organization);
  } catch (err) {
    console.error("Get Single Organization Error:", err);
    if (err.kind === "ObjectId") {
      return res
        .status(400)
        .json({ error: "Некоректний формат ID організації" });
    }
    res
      .status(500)
      .json({ error: "Помилка сервера при отриманні даних організації" });
  }
});

module.exports = router;

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

const ROLE_WEIGHTS = {
  superadmin: 100,
  admin: 50,
  reviewer: 30,
  "content-manager": 30,
  user: 10,
};

const verifyToken = (req, res, next) => {
  const token = req.cookies ? req.cookies.token : null;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Доступ заборонено. Авторизаційну куку не знайдено." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Недійсний або прострочений токен." });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "У вас недостатньо прав для цієї дії." });
    }
    next();
  };
};

const canManageUser = async (req, res, next) => {
  try {
    const actorRole = req.user.role;
    const actorId = req.user.id;
    const targetUserId = req.params.id;

    if (actorRole === "superadmin") return next();

    const targetUser = await User.findById(targetUserId);
    if (!targetUser)
      return res
        .status(404)
        .json({ message: "Цільового користувача не знайдено" });

    const actorWeight = ROLE_WEIGHTS[actorRole] || 0;
    const targetWeight = ROLE_WEIGHTS[targetUser.role] || 0;

    if (actorWeight <= targetWeight) {
      return res.status(403).json({
        message: "Недостатньо прав: ваша роль має рівну або нижчу вагу.",
      });
    }

    if (actorRole === "admin") {
      const currentUser = await User.findById(actorId);

      if (
        !currentUser.organizationId ||
        !targetUser.organizationId ||
        currentUser.organizationId.toString() !==
          targetUser.organizationId.toString()
      ) {
        return res.status(403).json({
          message: "Заборонено: цей користувач не є членом вашої організації.",
        });
      }
    }

    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Помилка авторизації ієрархії", error: error.message });
  }
};

module.exports = {
  verifyToken,
  checkRole,
  canManageUser,
  ROLE_WEIGHTS,
};

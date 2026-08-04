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

const verifyToken = async (req, res, next) => {
  const token = req.cookies ? req.cookies.token : null;

  if (!token) {
    return res
      .status(401)
      .json({ error: "Доступ заборонено. Авторизаційну куку не знайдено." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const userId = decoded.id || decoded._id;
    const freshUser = await User.findById(userId).select("-password").lean();

    if (!freshUser) {
      return res
        .status(401)
        .json({ error: "Користувача з цього токена більше не існує." });
    }

    if (freshUser.isBanned === true) {
      return res
        .status(403)
        .json({ error: "Ваш акаунт тимчасово або назавжди заблоковано." });
    }

    req.user = {
      ...freshUser,
      id: freshUser._id.toString(),
      _id: freshUser._id,
    };

    next();
  } catch (err) {
    return res.status(403).json({ error: "Недійсний або прострочений токен." });
  }
};

const optionalToken = async (req, res, next) => {
  const token = req.cookies ? req.cookies.token : null;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const freshUser = await User.findById(decoded.id)
      .select("-password")
      .lean();

    if (freshUser && !freshUser.isBanned) {
      req.user = freshUser;
    }
  } catch (err) {}
  next();
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "У вас недостатньо прав для цієї дії." });
    }
    next();
  };
};

const canManageUser = async (req, res, next) => {
  try {
    const actorRole = req.user.role;
    const actorId = req.user._id || req.user.id;
    const targetUserId = req.params.id;

    if (actorRole === "superadmin") return next();

    const targetUser = await User.findById(targetUserId).lean();
    if (!targetUser) {
      return res
        .status(404)
        .json({ error: "Цільового користувача не знайдено" });
    }

    const actorWeight = ROLE_WEIGHTS[actorRole] || 0;
    const targetWeight = ROLE_WEIGHTS[targetUser.role] || 0;

    if (actorWeight <= targetWeight) {
      return res.status(403).json({
        error: "Недостатньо прав: ваша роль має рівну або нижчу вагу.",
      });
    }

    if (actorRole === "admin") {
      const currentUser = req.user;

      if (
        !currentUser.organizationId ||
        !targetUser.organizationId ||
        currentUser.organizationId.toString() !==
          targetUser.organizationId.toString()
      ) {
        return res.status(403).json({
          error: "Заборонено: цей користувач не є членом вашої організації.",
        });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  verifyToken,
  optionalToken,
  checkRole,
  canManageUser,
  ROLE_WEIGHTS,
};

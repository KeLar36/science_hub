const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === "superadmin") {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Доступ дозволено лише суперадміністратору" });
};

const isAdmin = (req, res, next) => {
  const roles = ["admin", "superadmin"];
  if (req.user && roles.includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({ message: "Необхідні права адміністратора" });
};

const canManageContent = (targetUserRole) => {
  return (req, res, next) => {
    const actorRole = req.user.role;

    if (actorRole === "superadmin") return next();

    if (actorRole === "admin") {
      if (targetUserRole === "admin" || targetUserRole === "superadmin") {
        return res
          .status(403)
          .json({ message: "Адмін не може змінювати контент інших адмінів" });
      }
      return next();
    }

    return res.status(403).json({ message: "Недостатньо прав" });
  };
};

module.exports = { isSuperAdmin, isAdmin, canManageContent };

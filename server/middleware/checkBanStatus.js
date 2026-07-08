const User = require("../models/User");

const checkBanStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("isBanned");
    if (!user || user.isBanned) {
      return res
        .status(403)
        .json({ error: "Доступ заборонено: ваш акаунт заблоковано." });
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkBanStatus;

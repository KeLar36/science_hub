const mongoose = require("mongoose");

async function ensureSystemOrganization() {
  try {
    const User = mongoose.model("User");
    const Organization = mongoose.model("Organization");

    const superAdmin = await User.findOne({ role: "superadmin" });
    if (!superAdmin) {
      console.log(
        "Суперадміна не знайдено. Системну організацію 'Science Platform' поки не створено.",
      );
      return;
    }

    const systemOrg = await Organization.findOneAndUpdate(
      { name: "Science Platform" },
      {
        $setOnInsert: {
          name: "Science Platform",
          edrpou: "00000000",
          type: "Державна структура",
          legalForm: "ГО",
          city: "Ужгород",
          email: "support@science-platform.com",
          description:
            "Офіційна національна платформа для публікації провідних наукових програм, грантів та публікацій.",
          allowPublicJoin: false,
          creatorId: superAdmin._id,
        },
        $set: {
          isSystem: true,
          isVerified: true,
          status: "approved",
        },
        $addToSet: { members: superAdmin._id },
      },
      { upsert: true, new: true },
    );

    if (
      !superAdmin.organizationId ||
      String(superAdmin.organizationId) !== String(systemOrg._id)
    ) {
      superAdmin.organizationId = systemOrg._id;
      await superAdmin.save();
      console.log("Суперадміна успішно прив'язано до системної організації.");
    }

    console.log(
      "Системну організацію 'Science Platform' успішно перевірено та активовано!",
    );
  } catch (err) {
    console.error("Помилка ініціалізації системної організації:", err.message);
  }
}

module.exports = ensureSystemOrganization;

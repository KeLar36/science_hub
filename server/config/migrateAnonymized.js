require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

async function migrateUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Успішне підключення до MongoDB для міграції...");

    const resFalse = await User.updateMany(
      { isAnonymized: { $exists: false } },
      { $set: { isAnonymized: false } },
    );
    console.log(
      `Оновлено звичайних користувачів (isAnonymized: false): ${resFalse.modifiedCount}`,
    );

    const resTrue = await User.updateMany(
      {
        $or: [
          { email: { $regex: "^deleted_" } },
          { name: { $regex: "Анонімний дослідник" } },
        ],
      },
      {
        $set: {
          isAnonymized: true,
          isBanned: true,
        },
      },
    );
    console.log(
      `Промарковано вже анонімізованих акаунтів (isAnonymized: true): ${resTrue.modifiedCount}`,
    );

    console.log("Міграція успішно завершена!");
    process.exit(0);
  } catch (err) {
    console.error("Помилка під час міграції:", err);
    process.exit(1);
  }
}

migrateUsers();

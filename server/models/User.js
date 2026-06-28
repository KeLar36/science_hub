const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Пароль обов'язковий"],
      minLength: [8, "Пароль має бути не менше 8 символів"],
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxLength: 500,
    },
    topics: {
      type: [String],
      default: [],
    },
    city: {
      type: String,
      trim: true,
    },
    socials: {
      github: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedIn: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["Online", "Away", "Offline"],
      default: "Offline",
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    bookmarks: { type: [String], default: [] },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin", "reviewer", "content-manager"],
      default: "user",
    },
    isBanned: { type: Boolean, default: false },
  },
  {
    collection: "users",
    timestamps: true,
  },
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  domain: { type: String, index: true },

  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    index: true,
  },

  images: [
    {
      url: String,
      publicId: String,
      isHero: { type: Boolean, default: false },
    },
  ],

  status: {
    type: String,
    enum: ["draft", "pending", "published"],
    default: "draft",
  },
  views: { type: Number, default: 0 },

  reactions: {
    fire: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    heart: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    clap: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    idea: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

PostSchema.virtual("totalReactions").get(function () {
  return (
    this.reactions.fire.length +
    this.reactions.heart.length +
    this.reactions.clap.length +
    this.reactions.idea.length
  );
});

module.exports = mongoose.model("Post", PostSchema);

const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserTemp",
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserTemp",
    required: true,
    index: true,
  },
  coverImage: { type: String },
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  views: { type: Number, default: 0 },

  reactions: {
    fire: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserTemp" }],
    heart: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserTemp" }],
    clap: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserTemp" }],
    idea: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserTemp" }],
  },

  comments: [CommentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

PostSchema.virtual("commentsCount").get(function () {
  return this.comments.length;
});

module.exports = mongoose.model("Post", PostSchema);

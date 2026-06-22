const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: 300,
  },
  description: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      "Науковий журнал",
      "Стаття",
      "Грант",
      "Конференція",
      "Датасет",
      "Курс",
    ],
  },
  domain: {
    type: String,
    required: true,
    default: "Всі галузі",
  },

  issn: {
    type: String,
    trim: true,
  },
  impactFactor: {
    type: Number,
    default: 0,
  },

  amount: {
    type: String,
  },
  organizer: {
    type: String,
    trim: true,
  },
  externalLink: {
    type: String,
    trim: true,
  },

  // Системні поля
  active: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserTemp",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Program", ProgramSchema);

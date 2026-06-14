const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
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

  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Program", ProgramSchema);

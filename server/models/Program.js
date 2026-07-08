const mongoose = require("mongoose");

const BaseProgramSchema = new mongoose.Schema(
  {
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
    domain: {
      type: String,
      required: true,
      default: "Всі галузі",
    },
    active: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    discriminatorKey: "type",
    timestamps: true,
  },
);

const Program = mongoose.model("Program", BaseProgramSchema);

const JournalProgram = Program.discriminator(
  "Науковий журнал",
  new mongoose.Schema({
    issn: {
      type: String,
      required: true,
      trim: true,
    },
    impactFactor: {
      type: Number,
      default: 0,
    },
  }),
);

const GrantProgram = Program.discriminator(
  "Грант",
  new mongoose.Schema({
    amount: {
      type: String,
      required: true,
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
  }),
);

const ConferenceProgram = Program.discriminator(
  "Конференція",
  new mongoose.Schema({
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
    externalLink: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      default: "Онлайн",
    },
  }),
);

const DatasetProgram = Program.discriminator(
  "Датасет",
  new mongoose.Schema({
    externalLink: { type: String, trim: true },
  }),
);

const CourseProgram = Program.discriminator(
  "Курс",
  new mongoose.Schema({
    externalLink: { type: String, trim: true },
  }),
);

Program.JournalProgram = JournalProgram;
Program.GrantProgram = GrantProgram;
Program.ConferenceProgram = ConferenceProgram;
Program.DatasetProgram = DatasetProgram;
Program.CourseProgram = CourseProgram;

module.exports = Program;

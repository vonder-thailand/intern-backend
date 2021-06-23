const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questions = new Schema(
  {
    question_no: { type: String, default: "-" },
    question_category: { type: String, default: "-" },
    question_body: { type: String, default: "-" },
  },
  {
    strict: false,
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("questions", questions);

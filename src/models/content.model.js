const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contents = new Schema(
  {
    content_body: { type: String, default: "-" },
    title: { type: String, default: "-" },
    uid_likes: [{ type: [mongoose.ObjectId], default: ["-"] }],
    author_id: { type: mongoose.ObjectId, defalut: "-" },
    tag: { type: [String], defalut: ["-"] },
    content_type: { type: String, default: "board", require: true },
    image: {
      type: String,
      default:
        "https://vonderbucket1.s3.ap-southeast-1.amazonaws.com/userResult/60d96eb6add0dd4f80dd523e/51bd53bdd1240ce8d5e6569ca58a4c7a.jpeg",
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    strict: false,
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("contents", contents);

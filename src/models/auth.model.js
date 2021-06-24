const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const AuthSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    firstName: {
      type: String,
      default: "-",
    },
    lastName: {
      type: String,
      default: "-",
    },
    deleteAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    strict: false,
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

//hash password
AuthSchema.pre("save", async function (next) {
  const auth = this;
  const hash = await bcrypt.hash(auth.password, 10);
  this.password = hash;
  next();
});

//valid password
AuthSchema.methods.isValidPassword = async function (password) {
  const auth = this;
  const compare = await bcrypt.compare(password, auth.password);
  return compare;
};

const AuthModel = mongoose.model("auth", AuthSchema);

module.exports = AuthModel;

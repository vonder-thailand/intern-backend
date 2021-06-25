require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userAuth = require("../models/auth.model");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userAuth.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User donesn't exist." });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(404).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.Secret_Key,
      { expiresIn: "1h" }
    );
    res.status(200).json({ resuit: user, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};
exports.signup = async (req, res) => {
  const { email, password, username, role, firstName, lastName } = req.body;
  try {
    const hashedpassword = await bcrypt.hash(password, 10);
    const resuit = await userAuth.create({
      email,
      password: hashedpassword,
      username,
      role,
      firstName,
      lastName,
    });
    const token = jwt.sign(
      { _id: resuit._id, email: resuit.email, role: resuit.role },
      process.env.Secret_Key,
      { expiresIn: "1h" }
    );
    res.status(200).json({ resuit, token });
  } catch (error) {
    res.json({ error: error });
  }
};

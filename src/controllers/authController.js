require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./src/model/auth.model");

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await AuthModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User donesn't exist." });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(404).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
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
    const resuit = await AuthModel.create({
      email,
      password: hashedpassword,
      username,
      role,
      firstName,
      lastName,
    });
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.Secret_Key,
      { expiresIn: "1h" }
    );
    res.status(200).json({ resuit, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

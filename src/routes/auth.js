require("dotenv").config();
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res) => {
    res.json({
      message: "Signup successful",
      user: req.user,
    });
  }
);

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, auth) => {
    try {
      if (err || !auth) {
        const error = new Error("An error occurred.");

        return next(error);
      }

      req.login(auth, { session: false }, async (error) => {
        if (error) return next(error);

        const body = {
          _id: auth._id,
          username: auth.username,
          role: auth.role,
        };
        const accessToken = jwt.sign({ auth: body }, process.env.Secret_Key, {
          expiresIn: "14d",
        });
        const refreshtoken = jwt.sign({ auth: body }, process.env.Secret_Key, {
          expiresIn: "1800",
        });

        return res.json({ accessToken, refreshtoken });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }), //ถามพี่เพิ่ม
  (req, res) => {
    const decoded = jwt.verify(req.query.secret_token, process.env.Secret_Key);
    res.json({
      message: "You made it to the secure route",
      user: decoded.auth["_id"],
      token: req.query.secret_token,
    });
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;

require("dotenv").config();
require("./src/middlewares/auth");
const express = require("express");
const adminRoute = require("./src/Routes/admin");
const userRoutes = require("./src/Routes/users");
const authRoutes = require("./src/Routes/auth");
const guestRoute = require("./src/Routes/guest");
const connectToDatabase = require("./src/utils/mongo");
const app = express();
const port = 5000;

const { uploadManyFile } = require("./src/utils/s3");

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };
// var fileLimits = {
//   files: 1, // allow only 1 file per request
//   fileSize: 1024 * 1024, // 1 MB (max file size)
// };

const connectMongo = async (req, res, next) => {
  await connectToDatabase();
  next();
};
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(connectMongo);

app.use("/", authRoutes);

app.use(userRoutes);
app.use(adminRoute);
app.use(guestRoute);

app.use((err, req, res, next) => {
  console.log("ERROR: ", err);
  res
    .status(err.status || 500)
    .json({ message: "System fail!", error: err.message, status: err.status });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

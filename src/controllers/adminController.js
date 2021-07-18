const questionModel = require("../models/questions.model");
const resultModel = require("../models/result.model");
const {
  findAdminById,
  findAllAdmins,
  getAllUsers,
  postQuestion,
  postSummarise,
  getSummarise,
} = require("../functions/admin");

exports.getAllResult = async (req, res) => {
  const results = await resultModel.find();
  const { role } = req;
  if (role != "admin") {
    return res.status(400).json({
      status: "error",
      message: "only admin can access",
    });
  } else if (!results.length) {
    throw {
      message: "result not found",
      status: 404,
    };
  } else res.send(results);
};

exports.getAdminById = async (req, res, next) => {
  const { role } = req;
  if (role != "admin") {
    return res.status(400).json({
      status: "error",
      message: "only admin can access",
    });
  } else if (req.body._id) {
    const userId = req.body._id;
    const admin = await findAdminById(userId);
    res.send(admin);
  } else {
    const { userId } = req;
    const admin = await findAdminById(userId);
    res.send(admin);
  }
};

exports.getAllAdmins = async (req, res, next) => {
  const admins = await findAllAdmins();
  const { role } = req;
  if (role != "admin") {
    return res.status(400).json({
      status: "error",
      message: "only admin can access",
    });
  } else res.send(admins);
};
exports.getAllUsers = async (req, res, next) => {
  const users = await getAllUsers();
  res.send(users);
};

exports.getAllQuestions = async (req, res, next) => {
  const question = await questionModel.find({});
  const { role } = req;
  if (!question.length) {
    throw {
      message: "question not found",
      status: 404,
    };
  } else res.send(question);
};

exports.getQuestionByCat = async (req, res, next) => {
  const catName = req.body.categoryIndex;
  const question = await questionModel.find({ categoryIndex: catName });
  const { role } = req;
  if (role != "admin") {
    return res.status(400).json({
      status: "error",
      message: "only admin can access",
    });
  } else if (!question.length) {
    throw {
      message: "Invalid category",
      status: 400,
    };
  }
  res.send(question);
};

exports.getSummarise = async (req, res, next) => {
  const summarise = await getSummarise();
  res.send(summarise);
};

exports.postQuestion = async (req, res, next) => {
  const question = await postQuestion(req.body);
  const { role } = req;
  if (role != "admin") {
    return res.status(400).json({
      status: "error",
      message: "only admin can access",
    });
  } else res.send(question);
};

exports.postSummarise = async (req, res, next) => {
  const summarise = await postSummarise(req.body);
  const { role } = req;
  if (role != "admin") {
    return res.status(400).json({
      status: "error",
      message: "only admin can access",
    });
  } else res.send(summarise);
};

exports.updateFields = async (req, res, next) => {
  const up = await questionModel.updateMany(
    {},
    { $rename: { categoryIndex: "category_id" } }
  );
  const { role } = req;
  if (role != "admin") {
    return res.status(400).json({
      status: "error",
      message: "only admin can access",
    });
  } else res.send(up);
};

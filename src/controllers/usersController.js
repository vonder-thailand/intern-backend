const {
  // createUser,
  findUserById,
  updateUserById,
  deleteUserById,
  createResultById,
  getResultById,
  getAllUsers,
  createCommnet,
  createGuest,
  createContent,
  getAllContents,
  getSortByTag,
  contentIsLiked,
  getCommentByContentId,
  deleteContent,
  deleteComment,
  search,
} = require("../functions/index");
const { uploadManyFile } = require("../utils/s3");
const resultNew = require("../models/resultNew.model");
// find user by id
exports.findUserById = async (req, res, next) => {
  try {
    if (req.body._id) {
      const user = await findUserById(req.body._id);
      res.send(user);
    } else {
      const { userId } = req;
      console.log(userId);
      const user = await findUserById(userId);
      res.send(user);
    }
  } catch (err) {
    console.log("err: ", err);
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

//update user by id
exports.updateUserById = async (req, res, next) => {
  try {
    if (req.body._id) {
      const updateUser = await updateUserById(req.body, req.body._id);
      res.send(updateUser);
    } else {
      const { userId } = req;
      const updateUser = await updateUserById(req.body, userId);
      res.send(updateUser);
    }
  } catch (err) {
    console.log("err here: ", err);
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.deleteUserById = async (req, res, next) => {
  try {
    if (req.body._id) {
      const deleteUser = await deleteUserById(req.body._id);
      res.send(deleteUser);
    } else {
      const { userId } = req;
      const deleteUser = await deleteUserById(userId);
      res.send(deleteUser);
    }
  } catch (err) {
    console.log("err:", err);
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.createResultById = async (req, res, next) => {
  try {
    const answers = req.body;
    const user = await createResultById(answers, req);
    res.send(user);
  } catch (err) {
    console.log("err:", err);
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.send(users);
  } catch (err) {
    console.log("err: ", err);
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.postComment = async (req, res, next) => {
  try {
    const { userId } = req;
    const comment = await createCommnet(req.body, userId);
    res.send(comment);
  } catch (err) {
    console.log("err: ", err);
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.createGuest = async (req, res) => {
  try {
    const token = await createGuest();
    console.log("token: ", token);
    console.log(token);
    res.status(200).json({ token });
  } catch (err) {
    console.log("err: ", err);
    res.status(err.status || 500).send(err.message || "Internal Server Error");
  }
};

exports.getResultById = async (req, res, next) => {
  try {
    if (req.body._id) {
      const user = await getResultById(req.body._id);
      res.send(user);
    } else {
      console.log("ELSE");
      const { userId } = req;
      const user = await getResultById(userId);
      res.send(user);
    }
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.postContent = async (req, res) => {
  try {
    const { userId } = req;
    const content = await createContent(req.body, userId);
    res.send(content);
  } catch (err) {
    console.log("err: ", err);
    res.status(err.status || 500).send(err.message || "Internal Server Error");
  }
};

exports.getAllContents = async (req, res) => {
  try {
    const contents = await getAllContents();
    res.send(contents);
  } catch (err) {
    console.log("err: ", err);
    res.status(err.status || 500).send(err.message || "Internal Server Error");
  }
};

exports.getSortByTag = async (req, res, next) => {
  try {
    console.log(req.body.content_type);
    const ct_type = req.body.content_type.toLowerCase();
    if (req.body.dataSet) {
      const contents = await getSortByTag(
        req.body.tag,
        req.body.dataSet,
        ct_type
      );
      res.send(contents);
    } else {
      const contents = await getSortByTag(req.body.tag, null, ct_type);
      res.send(contents);
    }
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.postImage = async (req, res, next) => {
  //J calling
  try {
    const { userId, files } = req;
    const result = await uploadManyFile(files, userId, "userResult");
    console.log(result);
    res.send(result);
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
  }
};

exports.contentIsLiked = async (req, res, next) => {
  try {
    const content = await contentIsLiked(req.userId, req.body.content_id);
    res.send(content);
  } catch (err) {
    next(err);
  }
};

exports.getCommentByContentId = async (req, res, next) => {
  try {
    const page = req.params.page || 1;
    const r_limit = req.params.limit || 2;
    const limit = parseInt(r_limit);

    const comments = await getCommentByContentId(
      req.body.content_id,
      page,
      limit
    );
    res.send(comments);
  } catch (err) {
    next(err);
  }
};

exports.deleteContent = async (req, res, next) => {
  try {
    const content = await deleteContent(req.body.content_id);
    res.send(content);
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await deleteComment(req.body.comment_id);
    res.send(comment);
  } catch (err) {
    next(err);
  }
};

exports.search = async (req, res, next) => {
  try {
    if (req.body.content_type && req.body.tag) {
      const ct_type = req.body.content_type.toLowerCase();
      const search_result = await search(
        req.params.keyword,
        req.body.tag,
        ct_type
      );
      res.send(search_result);
    } else {
      res.send(await search(req.params.keyword, null, null));
    }
  } catch (err) {
    next(err);
  }
};

exports.postNewResult = async (req, res, next) => {
  const userId = req.userId;
  const tests = req.body;
  console.log("eiei");
  const array = [0, 0, 0, 0, 0, 0, 0, 0];
  const score = tests.map((each_test) => {
    const index = each_test.categoryId;
    if (each_test.categoryId == index) {
      array[index - 1] += each_test.score;
    }
  });
  console.log(array);
  // newResult = await resultNew.create({ userId: userId, results: test });
  // res.send(newResult);
};

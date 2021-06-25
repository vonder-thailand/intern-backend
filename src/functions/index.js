// functions function structure

const UserResult = require("../models/result.model");
const AdminModel = require("../models/admin.model");
const CommentModel = require("../models/comment.model");
const GuestModel = require("../models/guest.model");
const ContentModel = require("../models/content.model");
const QuestionModel = require("../models/questions.model");
const userAuth = require("../models/auth.model");

const bcrypt = require("bcrypt");

const { checkNumberInString } = require("../functions/verifyState");

var mongoose = require("mongoose");
const valid_id = mongoose.Types.ObjectId.isValid;

module.exports.findUserById = async (input) => {
  if (valid_id(input)) {
    return await userAuth.findOne({ _id: input, isDeleted: false });
  } else {
    throw {
      message: "userid is not defined",
      status: 404,
    };
  }
};

module.exports.updateUserById = async (payload, userId) => {
  let { firstName, lastName, password } = payload;
  password = await bcrypt.hash(password, 10);
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw {
      message: "userid is not defined",
      status: 404,
    };
  }

  console.log(isNaN(lastName), isNaN(firstName));
  if (isNaN(lastName) && isNaN(firstName)) {
    return userAuth.findOneAndUpdate(
      { _id: userId },
      { firstName, lastName, password },
      { new: true, omitUndefined: true }
    );
  }
  throw {
    message: "digit is not allowed in firstname or lastname",
    status: 404,
  };
};

module.exports.deleteUserById = async (userId) => {
  if (!valid_id(userId)) {
    throw {
      message: "userid is not defined",
      status: 404,
    };
  }

  return userAuth.findOneAndUpdate(
    { _id: userId },
    {
      delete_at: new Date(),
      isDeleted: true,
    },
    { new: true }
  );
};

module.exports.createResultById = async (results, userid) => {
  if (!valid_id(userid)) {
    throw {
      message: "user not found",
      status: 404,
    };
  }
  const user = await UserResult.find({ userid: userid });
  let questions = results.length;
  let results_array = [];
  let category = [
    {
      category_id: 1,
      skill: "Word Smart",
      score: 0,
    },
    {
      category_id: 2,
      skill: "Logic Smart",
      score: 0,
    },
    {
      category_id: 3,
      skill: "Picture Smart",
      score: 0,
    },
    {
      category_id: 4,
      skill: "Body Smart",
      score: 0,
    },
    {
      category_id: 5,
      skill: "Music Smart",
      score: 0,
    },
    {
      category_id: 6,
      skill: "People Smart",
      score: 0,
    },
    {
      category_id: 7,
      skill: "Self Smart",
      score: 0,
    },
    {
      category_id: 8,
      skill: "Nature Smart",
      score: 0,
    },
  ];

  for (let i = 0; i < questions; i++) {
    category_id = results[i]["categoryId"];
    score = results[i]["score"];
    if (category_id == 1) {
      category[0]["score"] += score;
    } else if (category_id == 2) {
      category[1]["score"] += score;
    } else if (category_id == 3) {
      category[2]["score"] += score;
    } else if (category_id == 4) {
      category[3]["score"] += score;
    } else if (category_id == 5) {
      category[4]["score"] += score;
    } else if (category_id == 6) {
      category[5]["score"] += score;
    } else if (category_id == 7) {
      category[6]["score"] += score;
    } else if (category_id == 8) {
      category[7]["score"] += score;
    } else {
      throw { message: "invalid category" };
    }
  }

  results_array.push(category);

  //no results in database
  if (!user.length) {
    return await UserResult.create({
      userid: userid,
      results: results_array,
    });
  } else {
    const array = user[0].results;
    array.push(category);
    return await UserResult.findOneAndUpdate(
      { userid: userid },
      { results: array },
      { new: true }
    );
  }
};

module.exports.getResultById = async (userid) => {
  return await UserResult.find({ userid: userid });
};

module.exports.getResultUsers = async () => {
  return await UserResult.find();
};

module.exports.getAdminById = async (input_id) => {
  if (valid_id(input_id)) {
    return await AdminModel.findOne({
      _id: input_id,
      isDeleted: false,
    });
  } else {
    throw {
      message: "admin not found",
      status: 404,
    };
  }
};

module.exports.getAllUsers = async () => {
  return await userAuth.find({
    role: "user",
    isDeleted: false,
  });
};

module.exports.createCommnet = async (input, user_id) => {
  const { comment_body, content_id } = input;
  return await CommentModel.create({ comment_body, content_id, uid: user_id });
};

// มีตัวเดียวรับเป็น parameter ได้เลย
module.exports.createGuest = async (input) => {
  const { name } = input;
  return await GuestModel.create({ name });
};

module.exports.createContent = async (input, id, name) => {
  const { content_body, title, likes, uid_likes, tag, image } = input;
  tag = tag.map((x) => {
    return x.toLowerCase();
  });
  return await ContentModel.create({
    content_body,
    title,
    likes,
    uid_likes,
    author_id: id,
    tag,
    image,
  });
};

module.exports.getAllContents = async () => {
  return await ContentModel.find({
    isDeleted: false,
  });
};

module.exports.getSortByTag = async (tag) => {
  tags = [
    "word smart",
    "logic smart",
    "picture smart",
    "body smart",
    "nature smart",
    "self smart",
    "people smart",
    "music smart",
  ];
  tag = tag.map((x) => {
    return x.toLowerCase();
  });

  tag.map((x) =>
    tags.indexOf(x) == -1
      ? (function () {
          throw { message: "Out of Tag", status: 404 };
        })()
      : console.log("pass")
  );
  return await ContentModel.find({
    tag: { $in: tag },
    isDeleted: false,
  });
};

module.exports.findAdminById = async (input) => {
  if (valid_id(input)) {
    return await userAuth.findOne({
      _id: input,
      role: "admin",
      isDeleted: false,
    });
  } else {
    throw {
      message: "user not found",
      status: 404,
    };
  }
};

module.exports.findAllAdmins = async () => {
  const admins = await userAuth.find({
    role: "admin",
    isDeleted: false,
  });
  if (!admins.length) {
    throw {
      message: "admin not found",
      status: 404,
    };
  }
  return admins;
};

module.exports.postQuestion = async (input) => {
  const question_no = input.question_no;
  const question_category = input.question_category.toLowerCase();
  const check_question_no = await QuestionModel.find({
    question_no: question_no,
  });

  console.log(question_category);

  //available question no.
  if (!check_question_no.length) {
    //invalid category
    if (
      question_category != "word smart" &&
      question_category != "logic smart" &&
      question_category != "picture smart" &&
      question_category != "body smart" &&
      question_category != "nature smart" &&
      question_category != "self smart" &&
      question_category != "people smart" &&
      question_category != "music smart"
    ) {
      throw {
        message: "Invalid category",
        status: 400,
      };
    }
    //available question no. and valid category
    else {
      const question = await QuestionModel.create(input);
      return question;
    }
    //question no. is not available
  } else {
    throw {
      message: `question number ${question_no} already exist`,
      status: 409,
    };
  }
};

module.exports.contentIsLiked = async (input_uid, input_content_id) => {
  if (!valid_id(input_content_id)) {
    throw {
      message: "content not found",
      status: 404,
    };
  }
  const content_obj = await ContentModel.find({
    _id: input_content_id,
    isDeleted: false,
  });
  const array = content_obj[0].uid_likes;
  for (let i = 0; i < array.length; i++) {
    if (array[i] == input_uid) {
      throw {
        message: "you already liked this post",
        status: 409,
      };
    }
  }
  array.push(input_uid);

  const content = await ContentModel.findOneAndUpdate(
    { _id: input_content_id, isDeleted: false },
    { uid_likes: array, $inc: { likes: 1 } },
    { new: true }
  );

  return content;
};

module.exports.getCommentByContentId = async (input_content_id) => {
  if (!valid_id(input_content_id)) {
    throw {
      message: "content not found",
      status: 404,
    };
  }

  const comments = await CommentModel.find({
    content_id: input_content_id,
    isDeleted: false,
  });

  if (!comments.length) {
    throw {
      message: "no comment found",
      status: 404,
    };
  }

  return comments;
};

module.exports.deleteContent = async (input_content_id) => {
  if (!valid_id(input_content_id)) {
    throw {
      message: "content not found",
      status: 404,
    };
  }

  const content = await ContentModel.findOneAndUpdate(
    { _id: input_content_id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!content)
    throw {
      message: "content not found",
      status: 404,
    };
  else {
    await CommentModel.updateMany(
      { content_id: input_content_id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
  }

  return content;
};

module.exports.deleteComment = async (input_comment_id) => {
  if (!valid_id(input_comment_id)) {
    throw {
      message: "comment not found",
      status: 404,
    };
  }

  const comment = await CommentModel.findOneAndUpdate(
    { _id: input_comment_id, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!comment)
    throw {
      message: "comment not found",
      status: 404,
    };

  return comment;
};

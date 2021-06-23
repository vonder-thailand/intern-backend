// functions function structure

const UserResult = require("../models/result.model");
const AdminModel = require("../models/admin.model");
const CommentModel = require("../models/comment.model");
const GuestModel = require("../models/guest.model");
const ContentModel = require("../models/content.model");
const QuestionModel = require("../models/questions.model");
const AuthModel = require("../models/auth.model");
const bcrypt = require("bcrypt");

const { checkNumberInString } = require("../functions/verifyState");

var mongoose = require("mongoose");
const valid_id = mongoose.Types.ObjectId.isValid;

module.exports.findUserById = async (input) => {
  if (valid_id(input)) {
    return await AuthModel.findOne({ _id: input, isDeleted: false });
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
    return AuthModel.findOneAndUpdate(
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

  return AuthModel.findOneAndUpdate(
    { _id: userId },
    {
      delete_at: new Date(),
      isDeleted: true,
    },
    { new: true }
  );
};

module.exports.createResultById = async (results, userid) => {
  let questions = results.length;
  let category = {
    "Word Smart": 0,
    "Logic Smart": 0,
    "Picture Smart": 0,
    "Body Smart": 0,
    "Music Smart": 0,
    "People Smart": 0,
    "Self Smart": 0,
    "Nature Smart": 0,
  };

  for (let i = 0; i < questions; i++) {
    category_id = results[i]["categoryId"];
    question_index = results[i]["questionIndex"];
    score = results[i]["score"];
    console;
    if (category_id == 1) {
      category["Word Smart"] += score;
    } else if (category_id == 2) {
      category["Logic Smart"] += score;
    } else if (category_id == 3) {
      category["Picture Smart"] += score;
    } else if (category_id == 4) {
      category["Body Smart"] += score;
    } else if (category_id == 5) {
      category["Music Smart"] += score;
    } else if (category_id == 6) {
      category["People Smart"] += score;
    } else if (category_id == 7) {
      category["Self Smart"] += score;
    } else if (category_id == 8) {
      category["Nature Smart"] += score;
    } else {
      throw { message: "invalid category" };
    }
  }
  return await UserResult.create({
    userid: userid,
    category: category,
  });
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
  return await AuthModel.find({
    role: "user",
    isDeleted: false,
  });
};

module.exports.createCommnet = async (input, user_id) => {
  const { comment_body } = input;
  return await CommentModel.create({ comment_body, uid: user_id });
};

// มีตัวเดียวรับเป็น parameter ได้เลย
module.exports.createGuest = async (input) => {
  const { name } = input;
  return await GuestModel.create({ name });
};

module.exports.createContent = async (input, id, name) => {
  const { content_body, title, likes, uid_likes, comment_id, tag, image } =
    input;
  return await ContentModel.create({
    content_body,
    title,
    likes,
    uid_likes,
    comment_id,
    author_username: name,
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
  });
};

module.exports.findAdminById = async (input) => {
  if (valid_id(input)) {
    return await AuthModel.findOne({
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
  const admins = await AuthModel.find({
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
  const question_category = input.question_category;
  const check_question_no = await QuestionModel.find({
    question_no: question_no,
  });

  //available question no.
  if (!check_question_no.length) {
    //invalid category
    if (
      question_category != "Word Smart" &&
      question_category != "Logic Smart" &&
      question_category != "Picture Smart" &&
      question_category != "Body Smart" &&
      question_category != "Nature Smart" &&
      question_category != "Self Smart" &&
      question_category != "People Smart" &&
      question_category != "Music Smart"
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
      message: "Duplicate question number",
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
  const content_obj = await ContentModel.find({ _id: input_content_id });
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

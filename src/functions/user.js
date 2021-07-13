const CommentModel = require("../models/comment.model");
const ContentModel = require("../models/content.model");
const userAuth = require("../models/auth.model");
const mongoose = require("mongoose");
const authModel = require("../models/auth.model");
const valid_id = mongoose.Types.ObjectId.isValid;
const resultNew = require("../models/resultNew.model");
const summariseModel = require("../models/summarise.model");

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
  let { firstName, lastName, email, username } = payload;
  /*password = await bcrypt.hash(password, 10);*/
  if (!valid_id(userId)) {
    throw {
      message: "invalid userId",
      status: 404,
    };
  }

  console.log(isNaN(lastName), isNaN(firstName));
  if (isNaN(lastName) && isNaN(firstName)) {
    return userAuth.findOneAndUpdate(
      { _id: userId },
      { firstName, lastName, email, username },
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
      message: "invalid userId",
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

module.exports.getResultUsers = async () => {
  return await resultNew.find();
};

module.exports.createCommnet = async (input, user_id) => {
  const { comment_body, content_id } = input;
  return await CommentModel.create({ comment_body, content_id, uid: user_id });
};

module.exports.createContent = async (input, id) => {
  let { content_body, title, likes, uid_likes, tag, content_type, image } =
    input;
  if (!title) {
    throw {
      message: "Please specify title",
      status: 203,
    };
  }
  if (!content_body) {
    throw {
      message: "Please specify content_body",
      status: 203,
    };
  }
  if (!content_type) {
    throw {
      message: "Please specify content_type",
      status: 203,
    };
  }
  content_type = content_type.toLowerCase();
  tag = tag.map((item) => {
    return item.toLowerCase();
  });

  return await ContentModel.create({
    content_body,
    title,
    likes,
    uid_likes,
    author_id: id,
    tag,
    content_type,
    image,
  });
};

module.exports.getAllContents = async () => {
  const content = await ContentModel.find({
    isDeleted: false,
  });

  const username = await authModel.find({ _id: content[0].author_id });
  const auth_username = username[0].username;
  const content_promise = content.map(async (element) => {
    const content = await this.formatContent(element, auth_username);
    return content;
  });
  const new_contents = await Promise.all(content_promise);
  return new_contents;
};

module.exports.getSortByTag = async (tag, dataSet, content_type) => {
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

  if (content_type.length && tag.length) {
    content_type = content_type.map((x) => {
      return x.toLowerCase();
    });

    tag = tag.map((item) => {
      return item.toLowerCase();
    });

    tag.map((item) =>
      tags.indexOf(item) == -1
        ? (function () {
            throw { message: "Out of Tag", status: 404 };
          })()
        : console.log("pass")
    );
    if (dataSet == null) {
      return await ContentModel.find({
        $and: [{ content_type: { $in: content_type } }, { tag: { $in: tag } }],
        isDeleted: false,
      });
    } else {
      let newItem = dataSet.filter((item) =>
        item.tag.some((r) => tag.indexOf(r) >= 0)
      );

      const filters = newItem.filter((item) =>
        content_type.includes(item.content_type)
      );

      return filters;
    }
  } else if (!content_type.length && !tag.length) {
    return await ContentModel.find({});
  } else if (!tag.length) {
    content_type = content_type.map((item) => {
      return item.toLowerCase();
    });

    if (dataSet == null) {
      return await ContentModel.find({
        content_type: { $in: content_type },
        isDeleted: false,
      });
    } else {
      const filters = dataSet.filter((item) =>
        content_type.includes(item.content_type)
      );

      return filters;
    }
  } else if (!content_type.length) {
    tag = tag.map((item) => {
      return item.toLowerCase();
    });
    if (dataSet == null) {
      return await ContentModel.find({
        tag: { $in: tag },
        isDeleted: false,
      });
    } else {
      let newItem = dataSet.filter((item) =>
        item.tag.some((r) => tag.indexOf(r) >= 0)
      );

      return newItem;
    }
  }
};

module.exports.contentIsLiked = async (input_uid, input_content_id) => {
  if (!valid_id(input_content_id)) {
    throw {
      message: "invalid comment id",
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

module.exports.getCommentByContentId = async (
  input_content_id,
  page,
  limit
) => {
  if (!valid_id(input_content_id)) {
    throw {
      message: "invalid comment id",
      status: 404,
    };
  }

  const comments = await CommentModel.find({
    content_id: input_content_id,
    isDeleted: false,
  })
    .skip((page - 1) * limit)
    .limit(limit);

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
      message: "invalid content id",
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
      message: "invalid comment id",
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

module.exports.search = async (input, tag, content_type) => {
  let new_input = new RegExp(input, "i");
  if (tag && content_type) {
    tag = tag.map((item) => {
      return item.toLowerCase();
    });
    content_type = content_type.map((item) => {
      return item.toLowerCase();
    });

    return await ContentModel.aggregate([
      {
        $lookup: {
          from: "userauths",
          localField: "author_id",
          foreignField: "_id",
          as: "author_data",
        },
      },

      {
        $match: {
          $or: [
            {
              content_type: { $in: content_type },
              tag: { $in: tag },
              isDeleted: false,
              "author_data.username": { $regex: new_input },
            },
            {
              content_type: { $in: content_type },
              tag: { $in: tag },
              isDeleted: false,
              title: { $regex: new_input },
            },
          ],
        },
      },
    ]);
  } else if (!tag && !content_type) {
    return await ContentModel.aggregate([
      {
        $lookup: {
          from: "userauths",
          localField: "author_id",
          foreignField: "_id",
          as: "author_data",
        },
      },
      {
        $match: {
          $or: [
            {
              isDeleted: false,
              "author_data.username": { $regex: new_input },
            },
            {
              isDeleted: false,
              title: { $regex: new_input },
            },
            {
              tag: { $regex: new_input },
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          content_body: 1,
          title: 1,
          likes: 1,
          uid_likes: 1,
          tag: 1,
          image: 1,
          isDeleted: 1,
          author_id: 1,
          created_at: 1,
          "author_data.username": 1,
          content_type: 1,
        },
      },
    ]);
  }
};

module.exports.getContentById = async (input) => {
  const user = await userAuth.findOne({
    _id: input,
  });
  if (!user) {
    throw {
      message: "invalid user id",
      status: 404,
    };
  }
  if (valid_id(input)) {
    const content = await ContentModel.find({
      author_id: input,
      isDeleted: false,
    });
    if (content == "") {
      throw {
        message:
          "Error from trying to get non-existing content, please create content first",
        status: 404,
      };
    }
    const username = await authModel.find({ _id: content[0].author_id });
    const auth_username = username[0].username;

    const content_promise = content.map(async (element) => {
      const content = await this.formatContent(element, auth_username);
      return content;
    });
    const new_contents = await Promise.all(content_promise);
    return new_contents;
  } else {
    throw {
      message:
        "Error from trying to get non-existing content, please create content first",
      status: 404,
    };
  }
};

//takes only 1 content object
module.exports.formatContent = async (content, username) => {
  const new_content = {
    _id: content._id,
    author_id: content.author_id,
    content_body: content.content_body,
    title: content.title,
    likes: content.likes,
    uid_likes: content.uid_likes,
    tag: content.tag,
    content_type: content.content_type,
    image: content.image,
    author_username: username,
    created_at: content.created_at,
    updated_at: content.updated_at,
  };
  return new_content;
};

//takes result = [score,score,score,score,score,score,score,score,date]
module.exports.formatResult = async (result) => {
  let summarise = await summariseModel.find();
  const score = result;
  const obj_arr = [];
  summarise.map((item, index) => {
    const obj_inside = {
      category_id: item.category_id,
      description: item.description,
      description_career: item.description_career,
      image_charactor: item.image_charactor,
      skill_summarize: item.skill_summarize,
      charactor_summarize: item.charactor_summarize,
      skill: item.skill,
      score: score[index] * 10,
      created_at: Date(score[8]),
    };
    obj_arr.push(obj_inside);
  });
  return obj_arr;
};

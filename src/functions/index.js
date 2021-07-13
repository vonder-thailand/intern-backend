const { filter } = require("../functions/const");

module.exports.arrayLower = (array) => {
  array = array.map((item) => {
    return item.toLowerCase();
  });
  return array;
};

module.exports.checkTag = (tag) => {
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

  tag.map((item) =>
    tags.indexOf(item) == -1
      ? (function () {
          throw { message: "Out of Tag", status: 404 };
        })()
      : console.log("pass")
  );
};

module.exports.dataSetFilterByTag = (tag, dataSet) => {
  let newItem = dataSet.filter((item) =>
    item.tag.some((r) => tag.indexOf(r) >= 0)
  );
  return newItem;
};

module.exports.dataSetFilterByContentType = (content_type, dataSet) => {
  const filters = dataSet.filter((item) =>
    content_type.includes(item.content_type)
  );
  return filters;
};

module.exports.checkStage = (tag, content_type, dataSet, stage) => {
  const tag_content = tag.length && content_type.length;
  const none = !content_type.length && !tag.length;

  if (tag_content && !dataSet) stage = filter.TAG_AND_CONTENT;
  else if (tag_content && dataSet) stage = filter.TAG_AND_CONTENT_WITH_DATASET;
  else if (none && !dataSet) stage = filter.NONE;
  else if (!tag.length && !dataSet) stage = filter.CONTENT;
  else if (!tag.length && dataSet) stage = filter.CONTENT_WITH_DATASET;
  else if (!content_type.length && !dataSet) stage = filter.TAG;
  else if (!content_type.length && dataSet) stage = filter.TAG_WITH_DATASET;

  return stage;
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
      created_at: new Date(score[8]),
    };
    obj_arr.push(obj_inside);
  });
  return obj_arr;
};

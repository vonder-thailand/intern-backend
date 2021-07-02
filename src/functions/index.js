// functions function structure

const UserResult = require("../models/result.model");
const AdminModel = require("../models/admin.model");
const CommentModel = require("../models/comment.model");
const GuestModel = require("../models/guest.model");
const ContentModel = require("../models/content.model");
const QuestionModel = require("../models/questions.model");
const userAuth = require("../models/auth.model");
const jwt = require("jsonwebtoken");

/*const bcrypt = require("bcrypt");*/

const { checkNumberInString } = require("../functions/verifyState");

var mongoose = require("mongoose");
const authModel = require("../models/auth.model");
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
  let { firstName, lastName, email, username } = payload;
  /*password = await bcrypt.hash(password, 10);*/
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

module.exports.calculateResult = async (results) => {
  let questions = results.length;
  let category = [
    {
      category_id: 1,
      skill: "ปัญญาด้านภาษา",
      score: 0,
      description:
        "ผู้ที่มีปัญญาหรือความถนัดด้านนี้จะสามารถรับรู้ เข้าใจ และใช้ภาษาในรูปแบบต่าง ๆ ได้ดี เช่น ภาษาพูด ภาษามือ สามารถเรียนรู้ผ่านภาษาได้ดี เช่น ฟังจับใจความได้ดี มีทักษะในการอ่านเขียน ใช้คําและจดจําข้อมูล และสื่อสารด้วยภาษาได้ดี จึงมักถ่ายทอดความคิดออกมาเป็นคําพูด มากกว่าเป็นภาพ เก่งในการเล่าเรื่อง อธิบาย สอน พูดโน้มน้าวใจ",
      description_career:
        "คุณครู, อาจารย์มหาวิทยาลัย, บรรณารักษ์, ผู้ดูแลรักษาโบราณวัตถุ, ผู้ดูแลพิพิธภัณฑ์, ผู้เชี่ยวชาญทางด้านภาษา, นักเขียน, ผู้ประกาศข่าวรายการโทรทัศน์, นักจัดรายการวิทยุ, นักข่าว, นักแปล, ล่าม, ทนายความ, ไกด์",
      image_charactor:
        "https://cdn.discordapp.com/attachments/821804175767764995/857608286038523924/Word.png",
      skill_summarize: "ความถนัดด้านการรับรู้ เข้าใจ และใช้ภาษาต่าง ๆ",
      charactor_summarize:
        "ผู้ที่มีปัญญาหรือความถนัดด้านนี้จะสามารถรับรู้ เข้าใจ และใช้ภาษาในรูปแบบต่าง ๆ ได้ดี เช่น ภาษาพูด ภาษามือ มีทักษะในการอ่านเขียน ใช้คําและจดจําข้อมูล",
    },
    {
      category_id: 2,
      skill: "ปัญญาด้านตรรกะ",
      score: 0,
      description:
        "หลายคนมักมองด้านความถนัดทางการคิดคำนวณเพียงอย่างเดียว แต่จริงๆ แล้วปัญญาหรือความถนัดด้านนี้หมายรวมถึงความถนัดในการเรียนรู้ด้วยเหตุผล ตรรกะ และตัวเลข โดยสามารถเชื่อมโยง ความคิดเชิงนามธรรมให้ออกมาในเชิงรูปธรรม เห็นความสัมพันธ์ระหว่างเหตุและผล ประเด็นที่เกี่ยวข้องกัน ผู้มีปัญญาด้านนี้จะ คิดเป็นระบบโดยเรียงลําดับตามเหตุการณ์ หรือตามตัวเลข มีทักษะในการแก้ปัญหาจัดลําดับหรือจัดกลุ่มข้อมูล มีทักษะด้านคณิตศาสตร์ เก่งที่จะเชื่อมโยงข้อมูลชิ้นต่าง ๆ เข้าเป็นภาพใหญ่ กระตือรือร้นสนใจสิ่งรอบตัว ชอบตั้งคําถามและทดลองเพื่อให้ได้คําตอบ",
      description_career:
        "ผู้ตรวจสอบบัญชี, นักบัญชี, นักคณิตศาสตร์, นักวิทยาศาสตร์, นักสถิติ, นักวิเคราะห์ระบบ, เจ้าหน้าที่เทคนิค",
      image_charactor:
        "https://cdn.discordapp.com/attachments/821804175767764995/857609973973647430/logic.png",
      skill_summarize: "ความถนัดด้านการคิดโดยใช้ตรรกะ เหตุผล และตัวเลข",
      charactor_summarize:
        "ปัญญาหรือความถนัดด้านนี้หมายรวมถึงความถนัดในการเรียนรู้ด้วยเหตุผล ตรรกะ และตัวเลข มีทักษะในการแก้ปัญหาจัดลําดับหรือจัดกลุ่มข้อมูล มีทักษะด้านคณิตศาสตร์",
    },
    {
      category_id: 3,
      skill: "ปัญญาด้านมิติสัมพันธ์",
      score: 0,
      description:
        "ผู้มีปัญญาหรือความถนัดด้านนี้โดดเด่น จะสามารถรับรู้ทางสายตาได้ดี มองเห็นพื้นที่ รูปทรง ระยะทาง และตําแหน่งอย่างเชื่อมโยงสัมพันธ์กัน ไวต่อการรับรู้ในเรื่องทิศทางระยะทางแผนผังแผนภาพหรือแผนที่ต่าง ๆ ชอบเรียนรู้ด้วยแผนที่ตารางแผนภูมิรูปภาพวิดีโอและภาพยนตร์ มีทักษะการสเก็ตช์ภาพ วาดเขียน รวมไปถึง การออกแบบภาพมิติต่าง ๆ และจัดวางองค์ประกอบภาพได้ดี",
      description_career:
        "วิศวกร, นักสำรวจ, ผู้สำรวจรังวัด, สถาปนิก, นักวางผังเมือง, นักออกแบบกราฟิก, นักออกแบบภายใน, ช่างภาพ, นักบิน",
      image_charactor:
        "https://cdn.discordapp.com/attachments/821804175767764995/857648796409135154/Picture.png",
      skill_summarize: "ความถนัดด้านการรับรู้ทางสายตา พื้นที่ รูปทรงต่าง ๆ",
      charactor_summarize:
        "ผู้มีปัญญาหรือความถนัดด้านนี้โดดเด่น จะสามารถรับรู้ทางสายตาได้ดี มองเห็นพื้นที่ รูปทรง ระยะทางสัมพันธ์กัน มีทักษะการสเก็ตช์ภาพ วาดเขียน",
    },
    {
      category_id: 4,
      skill: "ปัญญาด้านการเคลื่อนไหว",
      score: 0,
      description:
        "แสดงออกผ่านความสามารถที่จะควบคุมและเคลื่อนไหวร่างกาย ได้อย่างคุ้นเคย เป็นธรรมชาติ ผู้ที่มีปัญญาด้านนี้อย่างโดดเด่นจะสามารถจดจํา ประมวลข้อมูลของสิ่งที่อยู่รอบตัวในสามมิติ ทําให้สามารถควบคุมร่างกายและการเคลื่อนไหวให้เข้ากับสภาพแวดล้อมได้ดี ทําให้เต้นรําาและเล่นกีฬาได้คล่องแคล่ว มีความไวทางประสาทสัมผัสคล่องแคล่วแข็งแรงรวดเร็วและยืดหยุ่น มีทักษะในการใช้สายตาสัมพันธ์กับการใช้ส่วนอื่นๆ ของร่างกายทั้งมือและเท้า เช่น เล่นบอลได้ดี ยิงเป้าได้แม่น มีความสามารถในการใช้มือหรือส่วนต่างๆ ของร่างกายประดิษฐ์สร้างสรรค์สิ่งต่าง ๆ มักแสดงออกหรือสื่ออารมณ์ด้วยการเคลื่อนไหวร่างกายศิลปะการ",
      description_career:
        "นักกายภาพบำบัด, นักกีฬา, นักเต้น, นักแสดง, ช่างกล, ช่างไม้, เจ้าหน้าที่ดูแลป่าหรืออุทยาน, ช่างทำเครื่องประดับ",
      image_charactor:
        "https://cdn.discordapp.com/attachments/821804175767764995/857648808531066931/Body.png",
      skill_summarize: "ความถนัดด้านการควบคุม และเคลื่อนไหวร่างกาย",
      charactor_summarize:
        "ผู้ที่มีปัญญาด้านนี้อย่างโดดเด่นจะสามารถจดจํา ประมวลข้อมูลของสิ่งที่อยู่รอบตัวในสามมิติ มีทักษะในการใช้สายตาสัมพันธ์กับการใช้ส่วนอื่นๆ ของร่างกายทั้งมือและเท้า",
    },
    {
      category_id: 5,
      skill: "ปัญญาด้านดนตรี",
      score: 0,
      description:
        "ผู้ที่มีปัญญาหรือความถนัดด้านดนตรีจะสามารถสร้าง ซึมซับ และเข้าถึงสุนทรียะทางดนตรี จะรู้สึกเป็นธรรมชาติที่สุดเมื่อได้ถ่ายทอดตัวตน ความรู้สึกนึกคิดผ่านบทเพลง เสียงดนตรี หรือท่วงทํานอง ผู้มีปัญญาหรือความถนัดด้านนี้จะไวต่อเสียงที่อยู่รอบตัว เช่น เสียงกระดิ่ง หยดน้ำ สามารถแยกแยะเสียงจดจําจังหวะทํานองและโครงสร้างทางดนตรีได้ดี ทําให้มีทักษะในการร้องเพลง ผิวปาก ฮัมเพลง เคาะจังหวะ และเล่นเครื่องดนตรี",
      description_career:
        "นักดนตรี, ช่างจูนเปียโน, นักดนตรีบำบัด, นักร้องประสานเสียง, ผู้นำวงคอรัส, วาทยกร",
      image_charactor:
        "https://cdn.discordapp.com/attachments/821804175767764995/857648802730475530/Music.png",
      skill_summarize: "ความถนัดด้านการคิดโดยใช้ตรรกะ เหตุผล และตัวเลข",
      charactor_summarize:
        "ผู้ที่มีปัญญาหรือความถนัดด้านดนตรีจะสามารถสร้าง ซึมซับ และเข้าถึงสุนทรียะทางดนตรี มีทักษะในการร้องเพลง ผิวปาก ฮัมเพลง และเล่นเครื่องดนตรี",
    },
    {
      category_id: 6,
      skill: "ปัญญาด้านมนุษย์สัมพันธ์",
      score: 0,
      description:
        "ผู้มีปัญญาหรือความถนัดด้านนี้จะสามารถสร้างความสัมพันธ์และเข้าใจผู้อื่น มีทักษะในการเข้าใจถึงอารมณ์ ความรู้สึก แรงบันดาลใจ และแรงกระตุ้นของผู้คน สามารถมองสิ่งต่าง ๆ ด้วยมุมมองคนอื่น ๆ รอบตัวเพื่อให้เข้าใจว่าคนผู้นั้นนึกคิดหรือรู้สึกอย่างไร รับฟังและเข้าใจผู้อื่น มีความเห็นอกเห็นใจ มีความรู้สึกร่วม และให้คำปรึกษาได้ สื่อสารและทํางานร่วมกับผู้อื่นได้ดีมีความสามารถในการโน้มน้าวไปจนถึงเป็นแรงบันดาลใจให้กับผู้คน เป็นนักจัดการความขัดแย้งและประสานความร่วมมือ โดยใช้ทั้งภาษาพูดและภาษากาย",
      description_career:
        "นักบริหาร, นักปกครอง, ผู้จัดการ, นักจิตวิทยา, พยาบาล, นักประชาสัมพันธ์",
      image_charactor:
        "https://cdn.discordapp.com/attachments/821804175767764995/857648799459180544/People.png",
      skill_summarize: "ความถนัดด้านการได้ยิน แยกแยะเสียงต่าง ๆ ได้ดี",
      charactor_summarize:
        "ผู้มีปัญญาหรือความถนัดด้านนี้จะสามารถสร้างความสัมพันธ์และเข้าใจผู้อื่น มีทักษะในการเข้าใจถึงอารมณ์ ความรู้สึก แรงบันดาลใจ และแรงกระตุ้นของผู้คน",
    },
    {
      category_id: 7,
      skill: "ปัญญาด้านการเข้าใจตนเอง",
      score: 0,
      description:
        "ผู้ที่มีปัญญาหรือความถนัดด้านนี้โดดเด่น จะมีความสามารถในการรู้จัก ตระหนักรู้ และเท่าทันตนเอง มองภาพตนเองตามความเป็นจริง เข้าใจจุดแข็งและจุดอ่อนของตนชัดเจนว่าตนชอบหรือไม่ชอบอะไร วิเคราะห์แบบแผนการคิดของตนเองเข้าใจบทบาทหน้าที่ของตนและสัมพันธภาพกับผู้อื่น มีความเข้าใจอารมณ์ความรู้สึกและแรงจูงใจของตนเองอย่างลึกซึ้ง เชื่อมั่นในความสามารถของตัวเองและมีแรงจูงใจที่จะไปให้ถึงเป้าหมายและความใฝ่ฝัน ควบคุมการแสดงออกอย่างเหมาะสมตามกาลเทศะ",
      description_career:
        "นักจิตบำบัด, นักบำบัด, ผู้ให้คำปรึกษา, นักธุรกิจ, นักศาสนศาสตร์, นักเทววิทยา, ผู้วางนโยบาย, นักวางแผน",
      image_charactor:
        "https://cdn.discordapp.com/attachments/821804175767764995/857653351013679104/Self.png",
      skill_summarize: "ความถนัดด้านการเข้าใจจุดเด่น จุดด้อย ของตนเอง",
      charactor_summarize:
        "ผู้ที่มีปัญญาหรือความถนัดด้านนี้โดดเด่น จะมีความสามารถในการรู้จัก ตระหนักรู้ และเท่าทันตนเอง มีความเข้าใจอารมณ์ความรู้สึกและแรงจูงใจของตนเองอย่างลึกซึ้ง",
    },
    {
      category_id: 8,
      skill: "ปัญญาด้านธรรมชาติ",
      score: 0,
      description:
        "ผู้มีปัญญาหรือความถนัดด้านนี้ จะสนใจสิ่งมีชีวิตและสภาพแวดล้อมทางธรรมชาติ เข้าใจกฎเกณฑ์ ปรากฏการณ์ การเปลี่ยนแปลงในธรรมชาติ และปรับตัวเข้ากับสิ่งแวดล้อมได้ดี สามารถสังเกตและคาดการณ์ความเป็นไปของธรรมชาติและสิ่งแวดล้อม สามารถจัดจําาแนกแยกแยะประเภทของสิ่งมีชีวิตทั้งพืชและสัตว์ มีทักษะในการจัดระบบคิดภายในตัวเองแสดงความรู้สึกเห็นอกเห็นใจและเข้าใจธรรมชาติรอบตัว แยกแยะความเป็นจริงทั้งลักษณะร่วมและแตกต่างของสิ่งรอบตัวจดจําารายละเอียดสนุกกับการแจกแจง และจัดระบบสิ่งต่างๆ รอบตัว",
      description_career:
        "https://cdn.discordapp.com/attachments/821804175767764995/857648803897540678/Nature.png",
      image_charactor:
        "นักบินอวกาศ, นักพฤกษศาสตร์, นักวาดภาพประกอบสัตว์ป่า, นักอุตุนิยมวิทยา, เชฟ, นักธรณีวิทยา",
      skill_summarize: "ความถนัดด้านการปรับตัวตามสภาพแวดล้อมได้ดี",
      charactor_summarize:
        "ผู้มีปัญญาหรือความถนัดด้านนี้ จะสนใจสิ่งมีชีวิตและสภาพแวดล้อมทางธรรมชาติ มีทักษะในการจัดระบบคิดภายในตัวเองแสดงความรู้สึกเห็นอกเห็นใจและเข้าใจธรรมชาติรอบตัว",
    },
  ];

  //calculate result
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

  return category;
};

module.exports.createResultById = async (results, req) => {
  const userid = req.userId;

  //Invalid id
  if (!valid_id(userid)) {
    throw {
      message: "user not found",
      status: 404,
    };
  }

  //find existing result
  const user = await UserResult.find({ userid: userid });

  //calculate result
  let results_array = [];
  const calculated_result = await this.calculateResult(results);

  results_array.push(calculated_result);

  //no results in database
  if (!user.length) {
    return await UserResult.create({
      userid: userid,
      results: results_array,
    });
  } else {
    //there is an existing result in database
    const array = user[0].results;
    array.push(calculated_result);
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
module.exports.createGuest = async () => {
  const resuit = await GuestModel.create({});
  console.log(resuit);
  const token = jwt.sign({ _id: resuit._id }, process.env.Secret_Key, {
    expiresIn: "1d",
  });
  return token;
};

module.exports.createContent = async (input, id, name) => {
  let { content_body, title, likes, uid_likes, tag, image } = input;
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
  const questionIndex = input.questionIndex;
  const categoryIndex = input.categoryIndex;
  const questionBody = input.questionBody;
  if (!(parseInt(categoryIndex) <= 8 && parseInt(categoryIndex) >= 1)) {
    throw {
      message: "out of category index",
      status: 404,
    };
  }
  const ob = await QuestionModel.find({
    questionIndex: questionIndex,
    categoryIndex: categoryIndex,
  });
  console.log(ob.length);
  if (ob.length !== 0) {
    throw {
      message: "question redundant please check question number",
      status: 404,
    };
  } else {
    const question = await QuestionModel.create({
      questionIndex: questionIndex,
      categoryIndex: categoryIndex,
      questionBody: questionBody,
    });
    return question;
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

module.exports.getCommentByContentId = async (
  input_content_id,
  page,
  limit
) => {
  if (!valid_id(input_content_id)) {
    throw {
      message: "content not found",
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

module.exports.search = async (input, tag) => {
  let new_input = new RegExp(input, "i");

  if (tag) {
    tag = tag.map((x) => {
      return x.toLowerCase();
    });

    return ContentModel.aggregate([
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
              tag: { $in: tag },
              isDeleted: false,
              "author_data.username": { $regex: new_input },
            },
            {
              tag: { $in: tag },
              isDeleted: false,
              title: { $regex: new_input },
            },
          ],
        },
      },
    ]);
  } else {
    return ContentModel.aggregate([
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
    ]);
  }
};

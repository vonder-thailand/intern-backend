exports.calculateResult = async (results) => {
  let questions = results.length;
  const createAt = Date(Date.now);

  let category = [
    {
      category_id: 1,
      skill: "ปัญญาด้านภาษา",
      score: 0,
    },
    {
      category_id: 2,
      skill: "ปัญญาด้านตรรกะ",
      score: 0,
    },
    {
      category_id: 3,
      skill: "ปัญญาด้านมิติสัมพันธ์",
      score: 0,
    },
    {
      category_id: 4,
      skill: "ปัญญาด้านการเคลื่อนไหว",
      score: 0,
    },
    {
      category_id: 5,
      skill: "ปัญญาด้านดนตรี",
      score: 0,
    },
    {
      category_id: 6,
      skill: "ปัญญาด้านมนุษย์สัมพันธ์",
      score: 0,
    },
    {
      category_id: 7,
      skill: "ปัญญาด้านการเข้าใจตนเอง",
      score: 0,
    },
    {
      category_id: 8,
      skill: "ปัญญาด้านธรรมชาติ",
      score: 0,
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
      throw { message: "invalid category", status: 422 };
    }
  }

  return { category, createAt };
};

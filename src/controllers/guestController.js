const { calculateResult } = require("../functions/guest");

module.exports.calculateResult = async (req, res, next) => {
  const result = await calculateResult(req.body);
  res.send(result);
};

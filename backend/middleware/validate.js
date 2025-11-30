const { validationResult } = require("express-validator");

module.exports = function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "false",
      errors: errors.array().map((e) => ({ message: e.msg })),
    });
  }
  next();
};

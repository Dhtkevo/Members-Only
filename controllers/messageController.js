const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.showMessageForm = (req, res) => {
  res.render("new-message");
};

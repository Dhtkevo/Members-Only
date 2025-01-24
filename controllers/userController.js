const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.getRegisterUserForm = (req, res) => {
  res.render("sign-up");
};

exports.userCreatePost = asyncHandler(async (req, res, next) => {
  const { firstName } = req.body;
  const { lastName } = req.body;
  const { username } = req.body;
  const { password } = req.body;
  const { confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return next(new Error("Passwords do not match!"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.createUser(firstName, lastName, username, hashedPassword);
  return res.redirect("/");
});

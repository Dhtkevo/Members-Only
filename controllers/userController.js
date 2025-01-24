const db = require("../db/queries");
const bcrypt = require("bcryptjs");

exports.getRegisterUserForm = (req, res) => {
  res.render("sign-up");
};

exports.userCreatePost = async (req, res) => {
  const { firstName } = req.body;
  const { lastName } = req.body;
  const { username } = req.body;
  const { password } = req.body;
  const { confirmPassword } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);

  if (password === confirmPassword) {
    await db.createUser(firstName, lastName, username, hashedPassword);
    res.redirect("/");
  } else {
    res.redirect("/sign-up");
  }
};

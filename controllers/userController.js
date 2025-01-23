const db = require("../db/queries");

exports.getRegisterUserForm = (req, res) => {
  res.render("sign-up");
};

exports.userCreatePost = async (req, res) => {
  const { firstName } = req.body;
  const { lastName } = req.body;
  const { username } = req.body;
  const { password } = req.body;
  const { confirmPassword } = req.body;

  if (password === confirmPassword) {
    await db.createUser(firstName, lastName, username, password);
    res.redirect("/");
  } else {
    res.redirect("/sign-up");
  }
};

const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.showMessageForm = (req, res) => {
  res.render("new-message");
};

exports.newMessagePost = asyncHandler(async (req, res) => {
  const rows = await db.getUser(req.body.username);
  const user = rows[0];

  if (!user) {
    throw new Error("User does not exist!");
  }

  await db.createMessage(req.body.msgTitle, req.body.msgText, user.id);
  return res.redirect("/");
});

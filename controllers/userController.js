const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const validateUser = [
  body("firstName")
    .trim()
    .notEmpty()
    .isAlpha()
    .withMessage("First name is invalid"),
  body("lastName")
    .trim()
    .notEmpty()
    .isAlpha()
    .withMessage("Last name is invalid"),
  body("username").trim().notEmpty().isEmail().withMessage("Email is invalid"),
  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 4 })
    .withMessage("Password is invalid"),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .isLength({ min: 4 })
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords do not match!"),
];

exports.getRegisterUserForm = (req, res) => {
  res.render("sign-up");
};

exports.userCreatePost = [
  validateUser,
  asyncHandler(async (req, res, next) => {
    const { firstName } = req.body;
    const { lastName } = req.body;
    const { username } = req.body;
    const { password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(500).send(errors.array()[0].msg);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.createUser(firstName, lastName, username, hashedPassword);
    return res.redirect("/");
  }),
];

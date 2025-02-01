const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const passport = require("passport");

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

const validateSecret = [
  body("username")
    .trim()
    .notEmpty()
    .isEmail()
    .custom(
      asyncHandler(async (value) => {
        const userVal = await db.getUser(value);

        if (userVal.length !== 1) {
          throw new Error();
        }
      })
    )
    .withMessage("User does not exist! Create user first."),
  body("secretPass")
    .trim()
    .notEmpty()
    .withMessage("Please enter a secret password"),
];

exports.getRegisterUserForm = (req, res) => {
  res.render("sign-up");
};

exports.getSecretPasscodeForm = (req, res) => {
  res.render("secret");
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

exports.userSecretMember = [
  validateSecret,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(500).send(errors.array()[0].msg);
    }

    if (req.body.secretPass.toLowerCase() === process.env.SECRET_CODE) {
      await db.giveUserMembership(req.body.username);
    } else {
      throw new Error("That code is incorrect! Try again!");
    }

    return res.redirect("/");
  }),
];

exports.getLoginForm = (req, res) => {
  res.render("login");
};

exports.authenticateUser = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
});

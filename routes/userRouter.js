const { Router } = require("express");

const userRouter = Router();

const userController = require("../controllers/userController");

userRouter.get("/sign-up", userController.getRegisterUserForm);

module.exports = userRouter;

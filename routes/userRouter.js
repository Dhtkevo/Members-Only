const { Router } = require("express");

const userRouter = Router();

const userController = require("../controllers/userController");

userRouter.get("/sign-up", userController.getRegisterUserForm);

userRouter.post("/sign-up", userController.userCreatePost);

userRouter.get("/secret", userController.getSecretPasscodeForm);

module.exports = userRouter;

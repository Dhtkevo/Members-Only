const { Router } = require("express");

const userRouter = Router();

const userController = require("../controllers/userController");

userRouter.get("/sign-up", userController.getRegisterUserForm);

userRouter.post("/sign-up", userController.userCreatePost);

userRouter.get("/secret", userController.getSecretPasscodeForm);

userRouter.post("/secret", userController.userSecretMember);

userRouter.get("/login", userController.getLoginForm);

module.exports = userRouter;

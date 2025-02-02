const { Router } = require("express");

const messageRouter = Router();

const messageController = require("../controllers/messageController");

messageRouter.get("/new", messageController.showMessageForm);

module.exports = messageRouter;

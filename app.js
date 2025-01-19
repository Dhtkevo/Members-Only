require("dotenv").config();
const express = require("express");
const app = express();
const userRouter = require("./routes/userRouter");

app.set("view engine", "ejs");
app.use("/", userRouter);
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(process.env.PORT, () => {
  console.log(`Members-Only app listening on port ${process.env.PORT}`);
});

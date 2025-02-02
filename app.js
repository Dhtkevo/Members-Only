require("dotenv").config();

const express = require("express");
const app = express();
const userRouter = require("./routes/userRouter");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("./db/pool");
const bcrypt = require("bcryptjs");

app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.use((err, req, res, next) => {
  res.status(500).send(err.message);
});

app.listen(process.env.PORT, () => {
  console.log(`Members-Only app listening on port ${process.env.PORT}`);
});

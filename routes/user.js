let express = require("express");
let app = express.Router();
const passport = require("passport");


const { saveOriginalUrl } = require("../middlewares.js");

const {
  renderSignupForm,
  signup,
  renderLoginForm,
  logout,
  login,
} = require("../controller/user.js");

app
.route("/signup")
.get(renderSignupForm)
.post(signup);

app
.route("/login")
.get(renderLoginForm)
.post(
  saveOriginalUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  login
);

app.get("/logout", logout);

module.exports = app;

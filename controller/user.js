const User = require("../model/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("../view/users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({
      email: email,
      username: username,
    });
    let registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "Account created! Welcome to Wanderlust!");
      return res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/listings");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("../view/users/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", " Welcome to Wanderlust!");
  let redirectUrl = res.locals.originalUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout =  (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    else {
      req.flash("success", "Logged out succesfully");
      res.redirect("/listings");
    }
  });
}
const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup"); 
};
module.exports.signup = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    console.log("Received data:", req.body); 

    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    console.log("User registered:", registeredUser); 

    req.login(registeredUser, (err) => {
      if (err) {
        console.log("Login error:", err); 
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!");
      return res.redirect("/listings");
    });

  } catch (error) {
    console.log("Signup error:", error.message); 
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login"); 
};

module.exports.login = (req, res) => {
  console.log("User logged in:", req.user); // Debugging line

  req.flash("success", "Welcome back!");
  const redirectUrl = req.session.returnTo || "/listings";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};


module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You have logged out!");
    res.redirect("/listings");
  });
};

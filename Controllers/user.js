const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};

module.exports.signup = async (req, res, next) => {
  try {
    console.log("📥 Received signup data:", req.body);

    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      req.flash("error", "All fields are required!");
      return res.redirect("/signup");
    }

    const user = new User({ email, username });
    console.log("🛠 Creating User Object:", user);

    const registeredUser = await User.register(user, password);
    console.log("✅ User registered successfully:", registeredUser);

    if (!registeredUser._id) {
      console.error("❌ ERROR: _id is missing after registration!");
      req.flash("error", "Something went wrong during registration.");
      return res.redirect("/signup");
    }

    req.login(registeredUser, (err) => {
      if (err) {
        console.error("❌ Login error after signup:", err);
        return next(err);
      }
      console.log("✅ User logged in, redirecting...");
      req.flash("success", "Welcome to Wanderlust!");
      return res.redirect("/listings");
    });
  } catch (e) {
    console.error("❌ Registration error:", e);
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res, next) => {
  console.log("📌 Login successful. Checking redirect URL...");
  let redirectUrl = req.session.returnTo || "/listings";
  delete req.session.returnTo;
  console.log("🔀 Redirecting to:", redirectUrl);
  req.flash("success", "Welcome to Wanderlust!");
  return res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been logged out!");
    res.redirect("/listings");
  });
};
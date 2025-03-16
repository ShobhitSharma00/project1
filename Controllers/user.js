const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup"); // Ensure this EJS file exists in /views/users/signup.ejs
};

module.exports.signup = async (req, res, next) => {
  try {
    console.log("📥 Received signup data:", req.body); // Log incoming data
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      req.flash("error", "All fields are required!");
      return res.redirect("/signup");
    }

    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    console.log("✅ User registered successfully:", registeredUser);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings"); // Redirect after successful signup
    });
  } catch (e) {
    console.error("❌ Registration error:", e.message);
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};



module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");   
}

module.exports.login= async(req, res) => {
    req.flash("success", "Welcome to Wanderlust! You are logged in!");
   let redirectUrl=res.locals.redirectUrl|| "listings";
    res.redirect(redirectUrl ); 
  }

  module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out now")
        res.redirect("/listings");
    })
}
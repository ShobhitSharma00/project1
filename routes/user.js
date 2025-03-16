const express=require("express");
const router=express.Router();
const User=require("../models/user");
const wrapAsync = require("../utilits/wrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware");


const userController=require("../Controllers/user")

router.route("/signup")
  .get(userController.renderSignupForm) // Show signup form
  .post(wrapAsync(userController.signup)); // Call the signup function


  router.route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl, // Middleware to save where user was going
    passport.authenticate("local", { 
      failureRedirect: "/login", 
      failureFlash: true 
    }),
    userController.login
  );



router.get("/logout",userController.logout);;


module.exports=router;
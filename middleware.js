const Listing=require("./models/listing");
const ExpressError = require("./utilits/ExpressError.js");
const { listingSchema,reviewSchema}= require("./schema.js");
const Review=require("./models/review.js")


module.exports.isLoggedIn=(req,res,next)=>{
    if (!req.isAuthenticated()) {
      req.session.redirectUrl=req.originalUrl;
    req.flash("error","you must be logged to create listing");
    return res.redirect("/login");
      }
      next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  
  // ✅ Find the listing and populate the owner field
  let listing = await Listing.findById(id).populate('owner');
  
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  
  // ✅ Check if the current user is the owner
  if (!listing.owner._id.equals(req.user._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  
  next();
};




module.exports.validateListings = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  console.log("Received req.body:", req.body); // Debugging line

  let { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log("Validation Error:", error.details);
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;

  // ✅ Find the review and populate the author field
  let review = await Review.findById(reviewId).populate('author');

  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  // ✅ Check if the current user is the author
  if (!review.author._id.equals(req.user._id)) {
    req.flash("error", "You did not create this review");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
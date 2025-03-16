const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utilits/wrapAsync.js");
const { isLoggedIn, isOwner,validateListings } = require("../middleware.js");
const listingController=require("../Controllers/listings.js");
const multer=require('multer')
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

router
.route("/")
.get( wrapAsync(listingController.index))
 .post( isLoggedIn,  
  upload.single('listing[image]'),
  validateListings,
  wrapAsync(listingController.createListings));

router.get("/new", isLoggedIn,listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put( isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListings, wrapAsync(listingController.updateListing))
.delete( isLoggedIn,
 isOwner, wrapAsync(listingController.destroyListing));


// ✅ Edit Route (Only the owner can access)
router.get("/:id/edit", isLoggedIn,
  isOwner, wrapAsync(listingController.renderEditForm));
  
module.exports = router;

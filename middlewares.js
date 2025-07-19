const { listingSchema, reviewSchema } = require("./schema.js");
const wrapAsync = require("./utils/wrapAsync.js");
const Listing = require("./model/listing.js");
const Review = require("./model/reviews.js");
const ExpressError = require("./utils/expressError.js");
const mongoose = require("mongoose");

module.exports.isLoggedin = (
  customMessage = "Please log in to interact with the Wanderlust community"
) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.originalUrl = req.originalUrl;
      req.flash("error", customMessage);
      return res.redirect("/login");
    } else {
      next();
    }
  };
};

module.exports.saveOriginalUrl = (req, res, next) => {
  if (req.session && req.session.originalUrl) {
    res.locals.originalUrl = req.session.originalUrl;
    next();
  } else {
    next();
  }
};

module.exports.isOwner = (
  customMessage = "You are not authorized for this action!"
) => {
  return async (req, res, next) => {
    let { id } = req.params;

    try {
      let listing = await Listing.findById(id);

      if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
      }

      if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", customMessage);
        return res.redirect(`/listings/${id}`);
      }

      next();
    } catch (err) {
      console.error("Error in isOwner middleware:", err);
      req.flash("error", "Something went wrong!");
      res.redirect("/listings");
    }
  };
};

module.exports.validateListing = (req, res, next) => {
  let result = listingSchema.validate(req.body);
  if (result.error) {
    let msg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let result = reviewSchema.validate(req.body);
  if (result.error) {
    let msg = result.error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  let { id, reviewid } = req.params;
  let review = await Review.findById(reviewid);
  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

const express = require("express");
const app = express.Router({ mergeParams: true });
const {
  validateReview,
  isLoggedin,
  isOwner,
  isAuthor,
} = require("../middlewares.js");
const { postReview, destroyReview } = require("../controller/reviews.js");

//post Review
app.post(
  "/",
  isLoggedin("Please log in to share your review with Wanderlust community!"),
  validateReview,
  postReview
);

//destroy Review
app.delete(
  "/:reviewid",
  isLoggedin("Please log in to delete your review from Wanderlust community!"),
  isAuthor,
  destroyReview
);

module.exports = app;

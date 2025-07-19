const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../model/reviews.js");
const Listing = require("../model/listing.js");


//post Review
module.exports.postReview = wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.Review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review added Successfully!");
  console.log("review saved");
  res.redirect(`/listings/${listing._id}`);
});

//destroy Review
module.exports.destroyReview = wrapAsync(async (req, res) => {
  let { id, reviewid } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await Review.findByIdAndDelete(reviewid);
  req.flash("success", "Review Deleted Successfully!");
  res.redirect(`/listings/${id}`);
});

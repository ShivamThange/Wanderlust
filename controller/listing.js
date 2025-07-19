const Listing = require("../model/listing");
const wrapAsync = require("../utils/wrapAsync");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = wrapAsync(async (req, res) => {
  let allListings = await Listing.find({});
  res.render("./listing/index.ejs", { allListings });
});

module.exports.renderNewForm = (req, res) => {
  res.render("./listing/new");
};

module.exports.newListing = wrapAsync(async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image.url = url;
  newListing.image.filename = filename;

  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  newListing.geometry = response.body.features[0].geometry;

  let savedListing = await newListing.save();

  console.log(savedListing);

  req.flash("success", "New Listing created!");
  res.redirect("/listings");
});

module.exports.editListing = wrapAsync(async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findById(id);

  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not authorized to edit this listing!");
    res.redirect(`/listings/${id}`);
  } else {
    await Listing.findByIdAndUpdate(id, req.body.listing);

    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    listing.geometry = response.body.features[0].geometry;

    let savedListing = await listing.save();

    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };

      savedListing = await listing.save();
    }

    console.log(savedListing);
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
  }
});

module.exports.renderEditForm = wrapAsync(async (req, res) => {
  let { id } = req.params;
  let editListing = await Listing.findById(id);
  if (!editListing) {
    req.flash("error", "Requested Listing not Found!");
    return res.redirect("/listings");
  }
  originalImageUrl = editListing.image.url;
  orginalImageUrl = originalImageUrl.replace("/upload", "/upload/h_30,w_25");
  res.render("./listing/edit", { editListing, originalImageUrl });
});

module.exports.deleteListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  let deleted = await Listing.findByIdAndDelete(id);
  console.log(`${deleted} Deleted succeccesuly`);
  req.flash("success", "Listing Deleted succesfully!");
  res.redirect("/listings");
});

module.exports.showListing = wrapAsync(async (req, res) => {
  let { id } = req.params;
  let showListing = await Listing.findOne({ _id: id })
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!showListing) {
    req.flash("error", "Requested Listing not Found!");
    return res.redirect("/listings");
  }

  res.render("./listing/show", { showListing });
});

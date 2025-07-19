let express = require("express");
let app = express.Router();
const { isLoggedin, isOwner, validateListing } = require("../middlewares.js");
const {
  index,
  renderNewForm,
  newListing,
  editListing,
  renderEditForm,
  deleteListing,
  showListing,
} = require("../controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//New Listing Form
app.get(
  "/new",
  isLoggedin("Please log in to post listing on Wanderlust Commuinty"),
  renderNewForm
);

app
  .route("/")
  .get(
    //index route
    index
  )
  .post(
    //New Listing Backend Request
    isLoggedin("Please log in to post listing on Wanderlust Commuinty"),
    upload.single("listing[image]"),
    validateListing,
    newListing
  );

app
  .route("/:id")
  .patch(
    //edit listing Backend request
    isLoggedin("Please log in to edit listing on Wanderlust Commuinty"),
    isOwner("You are not authorized to edit this listing!"),
    upload.single("listing[image]"),
    validateListing,
    editListing
  )
  .delete(
    //delete Listing Backend Request
    isLoggedin("Please log in to delete listing on Wanderlust Commuinty"),
    isOwner("You are not authorized to delete this listing!"),
    deleteListing
  )
  .get(showListing);

//edit listing form
app.get(
  "/:id/edit",
  isLoggedin("Please log in to edit listing on Wanderlust Commuinty"),
  isOwner("You are not Authorized to edit this listing!"),
  renderEditForm
);

module.exports = app;

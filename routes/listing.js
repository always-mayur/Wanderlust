const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
.route("/")
//index route
.get(wrapAsync(listingController.index))
//new create route
.post(isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync( listingController.createListing )) ;


//adding new listing route
router.get("/new", isLoggedIn,listingController.renderNewForm);

//show details route
router
.route("/:id")
.get(wrapAsync( listingController.showListing))
//update route 
.put(isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing))
// delete route 
.delete(isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit",isLoggedIn,
    isOwner,
    wrapAsync( listingController.renderEditForm));

module.exports = router;
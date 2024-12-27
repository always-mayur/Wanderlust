const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.user);
    if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be login first to create listing")
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl; // Clear the session variable after using it
    }
    next();
}

module.exports.isOwner =async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","Your are not the owner of this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);  //joi usage
if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
} else {
    next();
}
};

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);  //joi usage
if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
} else {
    next();
}
};

module.exports.isReviewAuthor =async (req,res,next)=>{
    let {id,reviewid} = req.params;
    let review = await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","Your are not the owner of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
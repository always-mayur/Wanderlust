const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview=async(req,res)=>{
try {

    let listing = await Listing.findById(req.params.id);

    // Check if the geometry field is present
    if (!listing.geometry || !listing.geometry.type || !listing.geometry.coordinates) {
        listing.geometry = {
            type: 'Point',
            coordinates: [0, 0] // Default coordinates, update as needed
        };
        await listing.save();
    }



    let newReview =new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","New Review Added");
    res.redirect(`/listings/${listing.id}`);
    // console.log(newReview);

} catch (e) {
    req.flash('error', 'Something went wrong.');
    res.redirect('/listings');
}
};



module.exports.destroyReview = async(req,res)=>{
    let {id,reviewid} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid)

    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
};
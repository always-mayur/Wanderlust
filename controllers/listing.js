const Listing = require("../models/listing");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}

module.exports.renderNewForm =  (req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
            path:"author"
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you are looking for doesnt exists");
        return res.redirect("/listings"); // Add return here to prevent further execution
    }
    res.render("./listings/show.ejs",{listing});
};

module.exports.createListing = async(req,res,next)=>{
    try {

    let response= await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
    })
    .send();

    if (!response.body.features.length) {
        req.flash('error', 'Invalid location');
        return res.redirect('/listings/new');
    }


    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // to automatically add current user
    newListing.image = {url,filename};
    
    newListing.geometry = {
        type: 'Point',
        coordinates: response.body.features[0].geometry.coordinates
    };
    
    let savedListing = await newListing.save();
    // console.log(savedListing);

    req.flash("success","New Listing Created");
    // console.log(newListing);
    res.redirect("/listings");
} catch (e) {
    next(e);
}
};

module.exports.renderEditForm = async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you are looking for doesnt exists");
        return res.redirect("/listings");
    }
    let originalImageUrl =  listing.image.url;
    originalImageUrl =  originalImageUrl.replace("upload","upload/w_250");
    res.render("./listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing = async (req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
    }

    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let {id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
};

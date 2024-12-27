const mongoose = require("mongoose");
const Schema = mongoose.Schema ;
const Review = require("./review.js");

let listingSchema = new Schema({
    title:{
        type:String,required:true
    },
    description:String,
    price:Number,
    image:{
        url:String,
        filename:String,
    },

    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
geometry : {
    type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    },
    },
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("listing",listingSchema);
module.exports = Listing ;
const mongoose = require('mongoose');
const Schema = mongoose.Schema; //shortcut to reference mongoose .schema

// One to many 
// Imbeded an array of review object IDs inside each campground representing the reviews 

const reviewSchema = new Schema({
    body: String,
    rating: Number
});

module.exports = mongoose.model("Review", reviewSchema);

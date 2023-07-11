const mongoose = require('mongoose');
const Review = require('./review')

const Schema = mongoose.Schema; //shortcut to reference mongoose .schema

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [     //An array where we have object IDs
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
            // An object ID from the 'Review' model
        }
    ]
});

//Delete nested 
// Mongoose middleware: need to check the docs when coding middleware otherwise issues can arrise
// e.g 'findByIdAndDelete()' actually trigers 'findOneAndDelete()' middleware
// We have access to what was just deleted 'function (doc)'
// Using 'doc' we can take all the review IDs and delete them all
// Passes through doc because it is a query middleware - others use keyword 'this' instead  
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) { // If something was deleted (in case someone accidentally tried to delete nothing )
        await Review.remove({
            _id: { // Remove anything where the _id field is inside doc.reviews (doc being what was just deleted)
                $in: doc.reviews
            }
        })
    }
    console.log(doc)
})

module.exports = mongoose.model('Campground', CampgroundSchema);

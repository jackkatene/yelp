const express = require('express');

// Different routers have different req params, so this lets us access the campground id and the review id
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Review = require('../models/review');

const { reviewSchema } = require('../schemas.js'); // Destructured becasue other schemas will need requiring too

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');



const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body) // Error is part of the object we get back from doing reviewSchema.validate
    if (error) {
        const msg = error.details.map(el => el.message).join(',') // Details is an array of objects (could be more than one) so we map over them to create a new string 
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// REVIEWS ROUTE 
// Need the ID to associate the review with the campground 
router.post('/', validateReview, catchAsync(async (req, res) => {
    // req.params.id is a reference to the :id in the route
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review); // In html name = "review[rating]"
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

// DELETE REVIEWS
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // Remove the review from the reviews array on campground using mongo operator $pull
    // pull from the reviews array where we have reviewID
    await Campground.findByIdAndUpdate(id, {})
    //remove the review
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;
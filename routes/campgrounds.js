const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas.js'); // JOI schema
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');

// Middleware
const validateCampground = (req, res, next) => {
    // This schema is NOT a mongoose schema and will attempt to validate the data before it involve mongoose 
    // Joi schema is required from seperate file    
    const { error } = campgroundSchema.validate(req.body); // Validate the schema
    if (error) {
        const msg = error.details.map(el => el.message).join(',') // Details is an array of objects (could be more than one) so we map over them to create a new string 
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds }) //need to pass through what we want at that route 
}));

//order does matter. New will be treated as an ID if below /campgrounds/:id
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})


// Using the catchAsync code in utils to catch the error here
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // Here we can throw a new expr err because it is inside the catchAsync wrap so is handed off to next
    //if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made new campground');
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        // Return in place otherwise it will render campgrounds/show 
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        // Return in place otherwise it will render campgrounds/show 
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params; //gives us the ID
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params; //need to destructure it to have access to it
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}));

module.exports = router;
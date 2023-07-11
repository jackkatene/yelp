const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({ // Can pass in keys nested in campground
        image: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0)
    }).required()// Campground should be an object and it is expected to be there (required)
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})
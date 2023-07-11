//CREATING SEEDS TO TEST THE DATABASE

//self contained - connects to mongoose and the model
//file runs seperately and will be run any time we need to seed our database 

const mongoose = require('mongoose');
const Campground = require('../models/campground'); //double dot backs out one to the root directory
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection'));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({}); //delets everything in database
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eius reprehenderit accusantium ducimus ipsam velit qui inventore aperiam numquam quas illum commodi perspiciatis corrupti voluptatem dicta, quo blanditiis placeat quaerat labore.',
            price: price
        })
        await camp.save()
    }
};

seedDB().then(() => {
    mongoose.connection.close();
})
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//LOGIC TO CHECK IF THERE IS AN ERROR WHEN CONNECTING TO DATABASE
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection'));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs'); //templating engine
app.set('views', path.join(__dirname, 'views')) //connects the path views and working directory

// Configurations
app.use(express.urlencoded({ extended: true })) //parse the body 
app.use(methodOverride('_method')); //set method override for forms 
app.use(express.static(path.join(__dirname, 'public')));

// Cookies
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 + 60 * 60 * 24 * 7, // Expires after a week 
        maxAge: 1000 + 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
// Allows us to have persistent login sessions
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// Gets the user into a session 
passport.serializeUser(User.serializeUser())
// automatically will have access to this in our templates
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Specifying the router we want to use ('campgrounds') and a path we want to prefix them with 
// Everything starts with /campgrounds and want to use the campgroudds route
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes); // All reviews prefixed with ('etc')
//ROUTES SENT TO CAMPGROUNDS.JS

// For every request (all) and every path (*) 
// Order IMPORTANT : only runs if nothing is matched first
// When next is called it is passed on to the next error handler where err will be this
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

//our error handler
app.use((err, req, res, next) => {
    // Then error is destructured and default variables are set if they havent already been set 
    const { statusCode = 500 } = err;
    // We need to create the variable message if it hasn't already been set
    if (!err.message) err.message = 'Oh NO, Something Went Wrong!'
    res.status(statusCode).render('error', { err });
    // If something goes wrong caught by async wrap OR if we throw it => gets to this function (our error handler) 
})

app.listen(3000, () => {
    console.log('serving on port 3000')
})



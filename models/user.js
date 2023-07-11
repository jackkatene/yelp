const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        // Unique = not considered validation, sets up an index
        unique: true
    }
});
// Adds field for username (making sure theyre all unique) and fadds password field where password is hashed and salts added and gives us additional methods to the schema 
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
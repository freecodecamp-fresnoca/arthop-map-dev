const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    imageURL: String,
    points: Number,
    googleId: Number
});

module.exports = mongoose.model("User", userSchema);

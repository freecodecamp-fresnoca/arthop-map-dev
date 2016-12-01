const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  displayName: String,
  email: String,
  picture: String,
  points: Number,
  google: String,
  access_token: { type: String },
  locations: [{
    type: String
  }]
});

userSchema.statics.findOrCreate = function(filters, profile, cb) {
    User = this;
    this.find(filters, function(err, results) {
      if(results.length == 0) {
        var newUser = new User()
        newUser.googleId = filters.googleId
        newUser.username  = profile.displayName
        newUser.email = profile.emails[0].value // pull the first email
        newUser.photoURL = profile.photos[0].value
        newUser.points = 0
        newUser.locations = []

        newUser.save(function(err, doc) {
          cb(err, doc)
        });
      } else {
        cb(err, results[0]);
      }
    });
  };

module.exports = mongoose.model("User", userSchema);

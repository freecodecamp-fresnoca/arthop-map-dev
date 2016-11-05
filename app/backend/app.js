let express        = require('express'),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    methodOverride = require("method-override")
    morgan         = require("morgan"),
    venues         = require('./routes/venues.js'),
    googleAuth     = require('./config/googleAuth.js'),
    passport       = require('passport')
    GoogleStrategy = require('passport-google-oauth20').Strategy,
    User           = require('./models/user.js')

mongoose.connect("localhost:27017") 
app.use(bodyParser.urlencoded({extended: true})) 
app.use(methodOverride('_method')) 
app.use(morgan('dev')) 

passport.use(new GoogleStrategy({
    clientID: googleAuth.clientID,
    clientSecret: googleAuth.clientSecret,
    callbackURL: googleAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile)
    User.findOne({googleId: profile.id}, 'email username', function(err, user) {
      console.log(user, "after find one")
    })
  }
));

app.get('/', (req,res) => {res.send("<a href='/auth/google'>Google login</a>")})
app.get('/auth/google', passport.authenticate('google', { scope: ['email'] }))
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
  // Successful authentication, redirect home.
  console.log(req, " || ", res)
  res.send('Success')
})

app.use('/venues',venues);

let server = app.listen(3333, function(){
   console.log("ArtHop backend server started.")
})

module.exports = server

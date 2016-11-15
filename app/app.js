const express      = require('express'),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    methodOverride = require("method-override"),
    morgan         = require("morgan"),
    venues         = require('./backend/routes/venues.js'),
    googleAuth     = require('./backend/config/googleAuth.js'),
    passport       = require('passport'),
    User           = require('./backend/models/user.js'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    path           = require('path'),
    BearerStrategy = require('passport-http-bearer').Strategy

mongoose.connect("localhost:27017") 

app.use('/', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json()) 
app.use(methodOverride('_method')) 
app.use(morgan('dev')) 

passport.use(new GoogleStrategy({
    clientID        : googleAuth.clientID,
    clientSecret    : googleAuth.clientSecret,
    callbackURL     : googleAuth.callbackURL,
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(
      { googleId: profile.id },
      profile,
      function (err, result) {
          if(result) {
            result.access_token = accessToken;
            result.save(function(err, doc) {
              done(err, doc);
            });
          } else {
            done(err, result);
          }
        }
      );
    }
  )
)

passport.use(
  new BearerStrategy(
    function(token, done) {
      User.findOne({ access_token: token },
        function(err, user) {
          if(err) {
            return done(err)
          }
          if(!user) {
            return done(null, false)
          }

          return done(null, user, { scope: 'all' })
        }
      );
    }
  )
);


app.get('/auth/google', passport.authenticate('google', { scope: ['email profile'] }))

app.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: "/" }),
  function(req, res) {
    res.redirect("/profile?access_token=" + req.user.access_token);
  }
)

app.get(
    '/profile',
    passport.authenticate('bearer', { session: false }),
    function(req, res) {
      res.redirect('/')
    }
);

app.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/')
})

app.use('/venues', venues)

let server = app.listen(3333, function(){
   console.log("ArtHop backend server started.")
})

module.exports = server

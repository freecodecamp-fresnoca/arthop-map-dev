const express        = require('express'),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    methodOverride = require("method-override")
    morgan         = require("morgan"),
    venues         = require('./routes/venues.js'),
    googleAuth     = require('./config/googleAuth.js'),
    passport       = require('passport'),
    User           = require('./models/user.js'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    cookieParser   = require('cookie-parser'),
    session        = require('express-session')

mongoose.connect("localhost:27017") 
app.use(bodyParser.json()) 
app.use(methodOverride('_method')) 
app.use(morgan('dev')) 
app.use(cookieParser());
app.use(session({ 
  secret: '#jessie #teamdonut #triggered' ,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true  }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy({
    clientID        : googleAuth.clientID,
    clientSecret    : googleAuth.clientSecret,
    callbackURL     : googleAuth.callbackURL,
  },
  function(token, refreshToken, profile, done) {
    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Google
    process.nextTick(function() {
      // try to find the user based on their google id
      User.findOne({ 'google.id' : profile.id }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          // if a user is found, log them in
          return done(null, user);
        } else {
          // if the user isnt in our database, create a new user
          var newUser          = new User();
          // set all of the relevant information
          newUser.id    = profile.id;
          newUser.token = token;
          newUser.username  = profile.displayName;
          newUser.email = profile.emails[0].value; // pull the first email
          // save the user
          newUser.save(function(err) {
            if (err)
                throw err;
            return done(null, newUser);
          });
        }
      });
    });
  })
);

app.get('/', (req,res) => {res.send("<a href='/auth/google'>Google login</a>")})
app.get('/auth/google', passport.authenticate('google', { scope: ['email profile'] }))

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
  // Successful authentication, redirect home.
  console.log('\n\n\n\n\n\n\n',res,'\n\n\n\n\n\n')
  res.send('Success')
})

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
})

app.use('/venues',venues);

let server = app.listen(3333, function(){
   console.log("ArtHop backend server started.")
})

module.exports = server

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
    BearerStrategy = require('passport-http-bearer').Strategy,
    jwt            = require('jwt-simple'),
    moment         = require('moment'),
    request        = require('request')

mongoose.connect("localhost:27017") 

app.use('/', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true  }))
app.use(methodOverride('_method')) 
app.use(morgan('dev')) 

const TOKEN_SECRET = "secrit secrit"
/*
 |--------------------------------------------------------------------------
 | Login Required Middleware
 |--------------------------------------------------------------------------
 */
function ensureAuthenticated(req, res, next) {
  if (!req.header('Authorization')) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.header('Authorization').split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, TOKEN_SECRET);
  }
  catch (err) {
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  next();
}

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, TOKEN_SECRET);
}

/*
 |--------------------------------------------------------------------------
 | GET /api/me
 |--------------------------------------------------------------------------
 */
app.get('/api/me', ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    res.send(user);
  });
});

/*
 |--------------------------------------------------------------------------
 | PUT /api/me
 |--------------------------------------------------------------------------
 */
app.put('/api/me', ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    user.displayName = req.body.displayName || user.displayName;
    user.email = req.body.email || user.email;
    user.save(function(err) {
      res.status(200).end();
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Login with Google
 |--------------------------------------------------------------------------
 */
app.post('/auth/google/', function(req, res) {
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: googleAuth.clientSecret,
    redirect_uri: googleAuth.callbackURL,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token;
    var headers = { Authorization: 'Bearer ' + accessToken };
    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
      if (profile.error) {
        return res.status(500).send({message: profile.error.message});
      }
      // Step 3a. Link user accounts.
      if (req.header('Authorization')) {
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.google = profile.sub;
            user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
            user.displayName = user.displayName || profile.name;
            user.email = user.email || profile.email
            user.points = user.points || 0
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.send({ token: createJWT(existingUser) });
          }
          var user = new User();
          console.log({profile: profile})
          user.google = profile.sub;
          user.picture = profile.picture.replace('sz=50', 'sz=200');
          user.displayName = profile.name;
          user.email = profile.email
          user.points = 0
          user.save(function(err) {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
});

/*
 |--------------------------------------------------------------------------
 | Unlink Provider
 |--------------------------------------------------------------------------
 */
app.post('/auth/unlink', ensureAuthenticated, function(req, res) {
  var provider = req.body.provider;
  var providers = ['google'];

  if (providers.indexOf(provider) === -1) {
    return res.status(400).send({ message: 'Unknown OAuth Provider' });
  }

  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User Not Found' });
    }
    user[provider] = undefined;
    user.save(function() {
      res.status(200).end();
    });
  });
});
app.use('/venues', venues)

let server = app.listen(3333, function(){
   console.log("ArtHop backend server started.")
})

module.exports = server

// passport.use(new GoogleStrategy({
//     clientID        : googleAuth.clientID,
//     clientSecret    : googleAuth.clientSecret,
//     callbackURL     : googleAuth.callbackURL,
//   },
//   function(accessToken, refreshToken, profile, done) {
//     User.findOrCreate(
//       { googleId: profile.id },
//       profile,
//       function (err, result) {
//           if(result) {
//             result.access_token = accessToken;
//             result.save(function(err, doc) {
//               done(err, doc);
//             });
//           } else {
//             done(err, result);
//           }
//         }
//       );
//     }
//   )
// )

// passport.use(
//   new BearerStrategy(
//     function(token, done) {
//       User.findOne({ access_token: token },
//         function(err, user) {
//           if(err) {
//             return done(err)
//           }
//           if(!user) {
//             return done(null, false)
//           }

//           return done(null, user, { scope: 'all' })
//         }
//       );
//     }
//   )
// );


// app.get('/auth/google', passport.authenticate('google', { scope: ['email profile'] }))

// app.get('/auth/google/callback',
//   passport.authenticate('google', { session: false, failureRedirect: "/" }),
//   function(req, res) {
//     res.redirect("/profile?access_token=" + req.user.access_token);
//   }
// )

// app.get(
//     '/profile',
//     passport.authenticate('bearer', { session: false }),
//     function(req, res) {
//       res.redirect('/')
//     }
// );

// app.get('/logout', function(req, res) {
//   req.logout()
//   res.redirect('/')
// })


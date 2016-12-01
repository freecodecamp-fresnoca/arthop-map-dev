const express = require('express'),
      router = express.Router(),
      auth    = require('../middleware/auth.js'),
      User    = require('../models/user.js'),
      googleAuth = require('../config/googleAuth.js'),
      passport   = require('passport'),
      GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
      jwt            = require('jwt-simple'),
      request        = require('request')
/*
 |--------------------------------------------------------------------------
 | GET /api/me
 |--------------------------------------------------------------------------
 */
let createJWT = auth.createJWT

router.get('/api/me', auth.ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    res.send(user)
  })
})
/*
 |--------------------------------------------------------------------------
  | PUT /api/me
 |--------------------------------------------------------------------------
 */
router.put('/api/me', auth.ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' })
    }
    user.displayName = req.body.displayName || user.displayName
    user.email = req.body.email || user.email
    user.save(function(err) {
      res.status(200).end()
    })
  })
})

/*
 |--------------------------------------------------------------------------
 | Login with Google
 |--------------------------------------------------------------------------
 */
router.post('/auth/google/', function(req, res) {
  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token'
  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect'
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: googleAuth.clientSecret,
    redirect_uri: googleAuth.callbackURL,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
    var accessToken = token.access_token
    var headers = { Authorization: 'Bearer ' + accessToken }
    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
      if (profile.error) {
        return res.status(500).send({message: profile.error.message})
      }
      // Step 3a. Link user accounts.
      if (req.header('Authorization')) {
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Google account that belongs to you' })
          }
          var token = req.header('Authorization').split(' ')[1]
          var payload = jwt.decode(token, TOKEN_SECRET)
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' })
            }
            console.log(user)
            user.google = profile.sub
            user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200')
            user.displayName = user.displayName || profile.name
            user.email = user.email || profile.email
            user.points = user.points || 0
            user.locations = user.location || ["gibberish"]
            user.save(function() {
              var token = createJWT(user)
              res.send({ token: token })
            })
          })
        })
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ google: profile.sub }, function(err, existingUser) {
          if (existingUser) {
            return res.send({ token: createJWT(existingUser) })
          }
          var user = new User()
          console.log({profile: profile})
          user.google = profile.sub
          user.picture = profile.picture.replace('sz=50', 'sz=200')
          user.displayName = profile.name
          user.email = profile.email
          user.points = 0
          user.locations = []
          user.save(function(err) {
            var token = createJWT(user)
            res.send({ token: token })
          })
        })
      }
    })
  })
})

router.get('/auth/logout', auth.ensureAuthenticated, function(req,res) {
  console.log(req.user)
})
/*
 |--------------------------------------------------------------------------
 | Unlink Provider
 |--------------------------------------------------------------------------
 */
router.post('/auth/unlink', auth.ensureAuthenticated, function(req, res) {
  var provider = req.body.provider
  var providers = ['google']

  if (providers.indexOf(provider) === -1) {
    return res.status(400).send({ message: 'Unknown OAuth Provider' })
  }

  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User Not Found' })
    }
    user[provider] = undefined
    user.save(function() {
      res.status(200).end()
    })
  })
})

module.exports = router

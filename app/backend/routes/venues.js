//venues endpoint
const venues  = require('../models/venue.js'),
      User    = require('../models/user.js'),
      express = require('express'),
      jwt     = require('jwt-simple'),
      moment  = require('moment'),
      router  = express.Router()

router.get('/', (req,res,next) => {
  let output = venues().map(x => {
    return {name: x.name, address: x.address, location: {lat: x.location.lat, lng: x.location.lng}, type: x.type}
  })
  res.send(output)
})

router.post('/verify',ensureAuthenticated, (req, res, next) => {
  // console.log(req.body);
  /* req.body
  { 
    name: 'Bitwise Industries',
    business_key: 'SAMPLE KEY PHASE'  
  }
  */
  let inputKey = req.body.key
  let venue = venues().find(v => { return v.name === req.body.name; }) 

  // TODO: I will also need to check if user has already entered code for the venue
  if(venue.businessKey === inputKey) {
    User.findById(req.user, function(err, user) {
      
      user.points += 1 //We will want to do something like venue.points if we implement different points for each venue
      user.save(function(err) {
        if(err) {
          console.log("Error with saving the user", err)
          res.send({text: "Sorry error with saving your points"})
        }
        console.log("Points added to", user.displayName)
        res.send({ text: "Congrats! Here's a cookie.", points: user.points })
      })
    })
  } else {
    res.send({text: "Sorry key doesn't match."})
  }
})

module.exports = router

function ensureAuthenticated(req, res, next) {
  //I will have to refactor all the middleware/authentication into its own file
  const TOKEN_SECRET = "secrit secrit"
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



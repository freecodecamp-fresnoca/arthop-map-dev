//venues endpoint
const Venues  = require('../models/venue.js'),
      User    = require('../models/user.js'),
      express = require('express'),
      auth    = require('../middleware/auth.js')
      router  = express.Router()

let venues = new Venues

router.get('/', (req,res,next) => {
  res.send(venues.strip())
})

router.post('/verify', auth.ensureAuthenticated, (req, res, next) => {
  let name = Object.keys(req.body)[0];
  let inputKey = req.body[name].key
  // TODO: I will also need to check if user has already entered code for the venue
  if( venues.keyMatch(inputKey, name)) {
    //Look for current User
    User.findById(req.user, function(err, user) {
      // increase the points they have 
      if(user.locations.includes(name)) {
        res.send({text: "You have already entered a code for that location"})
      } else {
        user.points += 1 //We will want to do something like venue.points if we implement different points for each venue
        user.locations.push( name.toString() ) 

        user.save(function(err) {
          if(err) {
            console.log("Error with saving the user", err)
            //if there is an error we will display error message both on node server and send an error response
            res.send({text: "Sorry error with saving your points"})
          }
          // Otherwise we will send a congrats and their new point total
          res.send({ text: "Congrats! Here's a cookie.", points: user.points, user: user })
        })
      }
    })
  } else {
    // This happens if their key doesnt match. Just send back text saying it didn't match. We change later change what we want the HTTP response to be
    res.send({text: "Sorry key doesn't match."})
  }
})

module.exports = router


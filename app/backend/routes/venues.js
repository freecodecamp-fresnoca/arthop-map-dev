//venues endpoint
const venues  = require('../models/venue.js'),
      express = require('express'),
      router  = express.Router()

router.get('/', (req,res,next) => {
  let output = venues().map(x => {
    return {name: x.name, address: x.address, location: {lat: x.location.lat, lng: x.location.lng}, type: x.type}
  })
  res.send(output)
})

module.exports = router

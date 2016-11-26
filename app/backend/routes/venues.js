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

router.post('/verify', (req, res, next) => {
  // console.log(req.body);
  /* req.body ideal look
  { 
    name: 'Bitwise Industries',
    location: { lat: 123, lng: 101  },
    business_key: 'SAMPLE KEY PHASE'  
  }
  */
  let inputKey = req.body.businessKey
  let venue = venues().find(v => {
    return v.name === req.body.name;
  }) 
  res.send(venue)
})

module.exports = router

//venues endpoint
const venues  = require('../models/venue.js'),
      express = require('express'),
      router  = express.Router()

router.get('/', (req,res,next) => {
  res.send(venues())
})

module.exports = router

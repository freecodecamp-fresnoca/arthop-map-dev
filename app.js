const express      = require('express'),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    methodOverride = require("method-override"),
    morgan         = require("morgan"),
    venues         = require('./backend/routes/venues.js'),
    user           = require('./backend/routes/user.js')
    path           = require('path')

mongoose.connect("localhost:27017") 

app.use('/', express.static(path.join(__dirname, 'app')))
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true  }))
app.use(methodOverride('_method')) 
app.use(morgan('dev')) 

app.use('/venues', venues)
app.use(user)

let server = app.listen(3333, function(){
   console.log("ArtHop backend server started.")
})

module.exports = server


const express      = require('express'),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    methodOverride = require("method-override"),
    morgan         = require("morgan"),
    venues         = require('./backend/routes/venues.js'),
    user           = require('./backend/routes/user.js')
    path           = require('path')

let db = process.env.DB_CONN || "localhost:27017"

mongoose.connect(db)
process.env.PWD = process.cwd()
app.use('/', express.static(path.join(process.env.PWD + '/app')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true  }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))

app.use('/venues', venues)
app.use(user)

let server = app.listen(process.env.PORT || 3333, function(){
   console.log("ArtHop backend server started.")
})

module.exports = server

let express        = require('express'),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    methodOverride = require("method-override")
    morgan         = require("morgan"),
    venues         = require('./routes/venues.js')

mongoose.connect("localhost:27017") 
app.use(bodyParser.urlencoded({extended: true})) 
app.use(methodOverride('_method')) 
app.use(morgan('dev')) 

app.use('/venues',venues);

let server = app.listen(process.env.PORT || 3000, process.env.IP, function(){
     console.log("ArtHop backend server started.")
})

module.exports = server

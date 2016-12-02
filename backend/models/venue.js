let venues = require('./venues.json')

class Venues {
  constructor(){
    this.venues = venues
  }
}

Venues.prototype.strip = function() {
  return venues.map(venue => {
    return {name: venue.name, address: venue.address, location: {lat: venue.location.lat, lng: venue.location.lng}, type: venue.type}
  })
}

Venues.prototype.keyMatch = function(inputKey, venue) {
  let key = venues.find(v => { return v.name === venue }).businessKey
  return key === inputKey 
}


module.exports = Venues

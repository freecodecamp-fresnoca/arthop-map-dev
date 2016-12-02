let secrets = {
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
  callbackURL: "https://arthop.herokuapp.com" || 'http://localhost:3333'
}
module.exports = secrets

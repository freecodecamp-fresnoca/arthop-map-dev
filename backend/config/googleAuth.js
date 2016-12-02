let secrets = {
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
  callbackURL: process.env.IP || 'http://localhost:3333'
}
module.exports = secrets

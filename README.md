# arthop-map

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## Getting Started
1. git clone
2. cd into the folder `cd arthop-map-dev`
3. check node version `node --version`
  * If node < 6.4.0 install using nvm
  * `nvm use 6.4.0` or `nvm install 6.4.0`
  * if nvm is not installed on your machine
    * Installation instructions [bash] (https://github.com/creationix/nvm) [zsh] (https://github.com/lukechilds/zsh-nvm#manually)
4. Make sure nodemon is installed `nodemon --version`
  * To install run `npm install -g nodemon`
5. Run `npm install` to install dependencies
6. Run `cd app/public/ && bower install`
  * Remember to `cd ../..` to get back to root directory
  * If bower is not globally installed run `npm install -g bower`
7. Create googleAuth.js file in path ‘/backend/config/’ (copy & paste file content from Slack channel )
8. On another terminal tab/window run `mongod` to start mongodb server
  * If not installed follow instruction directions
    * [OS X] (http://treehouse.github.io/installation-guides/mac/mongo-mac.html)
    * [Linux] (https://docs.mongodb.com/v3.0/administration/install-on-linux/)
9. Run `nodemon app-dev.js` to start node server in the development environment.
10. Application will be found at localhost:3333

## Development Environment

Run `npm install` and `bower install`<br/>
Run `nodemon app-dev.js` to get node server running

## Production Environment
*Request heroku access for production permission*
*If you only want to test functionality in the production environment, you can follow the steps below*
Run `grunt build`<br/>
Add the contents of the build to the 'public' directory on the root of the app
*Build configuration pending*
Run `npm start` to get node server running the production files

## Testing

Running `grunt test` will run the unit tests with karma.

## JSON Data information

```
** Categories (venue.type) **
Gallery
Museum
Studio
General Business
General Organization
School
Government Building
Food & Drink
Entertainment
Bar
Site
```

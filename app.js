/**
 * Module dependencies.
 */

var _ = require('lodash');
var express = require('express');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var connectAssets = require('connect-assets');
var path = require('path');

/**
 * Controllers (route handlers).
 */

var mainController = require('./controllers/main');

/**
 * Create Express server.
 */

var app = express();

var hour = 3600000;
var day = hour * 24;
var week = day * 7;

/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(connectAssets({
  paths: ['build/css', 'build/js', 'build/libs'],
  helperContext: app.locals
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride());
// app.use(session({}));
app.use(express['static'](path.join(__dirname, 'build'), {
  maxAge: week
}));

/**
 * Main routes.
 */

app.get('/', mainController.index);

/**
 * 500 Error Handler.
 */

app.use(errorHandler());

/**
 * Start Express server.
 */

app.listen(app.get('port'), function () {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
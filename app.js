/**
 * Check gc
 */

if (!global.gc) {
  return console.error('Need run include flag --expose-gc "example: node --expose-gc app.js"');
}

/**
 * Module dependencies.
 */

var express = require('express'),
  errorHandler = require('errorhandler'),
  methodOverride = require('method-override'),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  connectAssets = require('connect-assets'),
  path = require('path'),
  multipart = require('connect-multiparty');

/**
 * Controllers (route handlers).
 */

var mainController = require('./controllers/main');
var schedule = require('./controllers/schedule');
schedule.init();

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
  paths: ['build/css', 'build/js', 'build/vendors', 'build/fonts'],
  helperContext: app.locals
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(methodOverride());
app.use(express['static'](path.join(__dirname, 'build'), {
  maxAge: week
}));

/**
 * Main routes.
 */

app.get('/', mainController.index);
app.get('/controll/play', mainController.play);
app.get('/controll/stop', mainController.stop);
app.get('/controll/next', mainController.next);
app.get('/controll/prev', mainController.prev);
app.get('/controll/track', mainController.track);

app.get('/list/add', mainController.add);
app.post('/list/load', multipart(), mainController.load);
app.get('/list/clear', mainController.clear);

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
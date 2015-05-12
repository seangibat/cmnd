var SESSION_KEY = process.env.SESSION_KEY || "development";

var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var session    = require('express-session');
var User       = require('./models/userModel');
var ejs        = require('ejs');

var apiRouter    = require('./routes/api');
var portalRouter = require('./routes/portal');

mongoose.connect('mongodb://localhost:27017/cmnd-development');

var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');

app.use(session({
  secret: SESSION_KEY,
  saveUninitalized: true,
  resave: true
}));

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;

app.use('/', portalRouter);
app.use('/api', apiRouter);

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something blew up!' });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.end({ error: err });
}

app.listen(port);

console.log('Running on port ' + port);
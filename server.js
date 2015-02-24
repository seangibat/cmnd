var SESSION_KEY = process.env.SESSION_KEY || "development";

var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var passport   = require('passport');
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

app.use(passport.initialize());

app.use(session({
  secret: SESSION_KEY,
  saveUninitalized: true,
  resave: true
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;

app.use('/', portalRouter);
app.use('/api', apiRouter);

app.listen(port);

console.log('Running on port ' + port);
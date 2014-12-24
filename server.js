var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var passport = require('passport');
var session = require('express-session');

var commandController = require('./controllers/command');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');
var clientController = require('./controllers/client');
var oauth2Controller = require('./controllers/oauth2');
var applicationController = require('./controllers/application');

mongoose.connect('mongodb://localhost:27017/cmnd');

var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(passport.initialize());
app.set('view engine', 'ejs');
app.use(session({
  secret: 'Super Secret Session Key',
  saveUninitalized: true,
  resave: true
}));

var port = process.env.PORT || 3001;

var router = express.Router();

router.get('/', function(req, res) {
  res.json({ message: 'Default get route' });
});

router.route('/commands')
  .post(authController.isAuthenticated, commandController.postCommands)
  .get(authController.isAuthenticated, commandController.getCommands);

router.route('/commands/:command_id')
  .get(authController.isAuthenticated, commandController.getCommand);

router.route('/users')
  .post(userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);

router.route('/users/:user_id/applications')
  .post(authController.isAuthenticated, userController.postUsersApplications)
  .get(authController.isAuthenticated, userController.getUsersApplications);

router.route('/clients')
  .post(authController.isAuthenticated, clientController.postClients)
  .get(authController.isAuthenticated, clientController.getClients);

router.route('/oauth2/authorize')
  .get(authController.isAuthenticated, oauth2Controller.authorization)
  .post(authController.isAuthenticated, oauth2Controller.decision);

router.route('/oauth2/token')
  .post(authController.isClientAuthenticated, oauth2Controller.token);

// Routes that applications get for use in setting up. Directories based on the command.
router.route('/applications/:command_word/redirect/')
  .get(authController.isAuthenticated, applicationController.getRedirect)
  .post(authController.isAuthenticated, applicationController.postRedirect);

router.route('/applications/')
  .get(authController.isAuthenticated, applicationController.getApplications)
  .post(authController.isAuthenticated, applicationController.postApplications);

router.route('/applications/:command_word')
  .get(authController.isAuthenticated, applicationController.getApplication);

// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(port);

console.log('Insert command on port ' + port);
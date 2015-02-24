var authController = require('../controllers/authController');
var commandController = require('../controllers/commandController');
var userController = require('../controllers/userController');
var pluginController = require('../controllers/pluginController');
var jailedController = require('../controllers/jailedController');

var router = require('express').Router();

router.use(authController.isClientAuthenticated);

router.route('/commands')
  .post(jailedController.postCommands)
  .get(commandController.getCommands);

router.route('/user')
  .get(userController.getUsers);

router.route('/user/plugins')
  .post(userController.postUsersPlugins)
  .get(userController.getUsersPlugins);

// Routes that applications get for use in setting up. Directories based on the command.
router.route('/plugins/:command_word/redirect/')
  .get(jailedController.getRedirect)
  .post(jailedController.postRedirect);

router.route('/plugins/:command_word/config/')
  .get(jailedController.config);

router.route('/plugins/')
  .get(pluginController.getPlugins)
  .post(pluginController.postPlugins);

module.exports = router;
var portalController = require('../controllers/portalController');
var authController = require('../controllers/authController');
var userController = require('../controllers/userController');
var passport = require('passport');
var router = require('express').Router();

router.route('/')
  .get(portalController.index);

router.route('/api/user')
  .post(userController.postUsers);

router.use(authController.isAuthenticated);

router.route('/login')
  .post(portalController.login);

router.route('/logout')
  .get(portalController.logout);

router.route('/dashboard')
  .get(portalController.dashboard);


module.exports = router;
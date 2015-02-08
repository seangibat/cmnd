var portalController = require('../controllers/portalController');
var authController = require('../controllers/authController');
var userController = require('../controllers/userController');
var router = require('express').Router();

router.route('/')
  .get(portalController.index);

router.route('/api/user')
  .post(userController.postUsers);

router.route('/login')
  .post(authController.isAuthenticated);

router.route('/dashboard')
  .get(authController.isAuthenticated, portalController.dashboard);

module.exports = router;
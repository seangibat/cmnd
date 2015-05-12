var portalController = require('../controllers/portalController');
var authController = require('../controllers/authController');
var userController = require('../controllers/userController');
var passport = require('passport');
var router = require('express').Router();

router.route('/api/user')
  .post(userController.postUsers);

router.route('/login')
  .post(passport.authenticate('local', { session: true, successRedirect: "/dashboard", failureRedirect: "/" }));

router.route('/logout')
  .get(authController.isAuthenticated, portalController.logout);

router.route('/dashboard')
  .get(authController.isAuthenticated, portalController.dashboard);

router.route('/')
  .get(portalController.index);

module.exports = router;
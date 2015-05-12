var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/userModel');

passport.use(new BasicStrategy(
  function(username, password, callback) {
    User.findOne({ username : username }, function(err, user){
      if (err) return callback(err);
      if (!user) return callback(null, false);
      user.verifyPassword(password, function(err, isMatch) {
        if (err) return callback(err);
        if (!isMatch) { return callback(null, false); }
        return callback(null, user);
      });
    });
  }
));

passport.use(new LocalStrategy(
  function(username, password, callback) {
    User.findOne({ username : username }, function(err, user){
      if (err) return callback(err);
      if (!user) return callback(null, false);
      user.verifyPassword(password, function(err, isMatch) {
        if (err) return callback(err);
        if (!isMatch) { return callback(null, false); }
      return callback(null, user);
      });
    });
  }
));

exports.isAuthenticated = passport.authenticate('local', { session: true, failureRedirect: '/', successRedirect: '/dashboard' });
exports.isClientAuthenticated = passport.authenticate('basic', { session: false });
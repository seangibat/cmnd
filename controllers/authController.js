var auth = require('basic-auth')
var User = require('../models/userModel');

var verifyUser = function(username, password, callback){
  User.findOne({ username : username }, function(err, user){
    if (err) return callback("Error authenticating.");
    if (!user) return callback("No such user.");
    user.verifyPassword(password, function(err, isMatch) {
      if (err) return callback("Error authenticating.");
      if (!isMatch) return callback("Incorrect password.");
      callback(null, user);
    });
  });
};

var authFlow = function(req, res, next){
  var credentials = auth(req);
  var session = req.session;

  // If they've already logged in.
  if (session.user) {
    req.user = session.user;
    next();
  } 
  // If they're using BasicAuth -- like for the API.
  else if (credentials && credentials.username) {
    verifyUser(credentials.username, credentials.password, function(err, user){ 
      if (err) return next(err);

      req.user = user;
      next();
    });
  }
  // If they're trying to login.
  else if (req.body.username) {
    verifyUser(req.body.username, req.body.password, function(err, user){
      if (err) return res.redirect('/');

      req.session.user = user;
      req.user = user;
      next();
    });
  }
  else {
    res.redirect('/');
  }
};

var getUser = function(req, res, next){
  console.log("get user");
  User.findOne({ _id : req.user._id}, function(err, user){

    req.session.user = user;
    next();
  });
};

exports.isAuthenticated = [authFlow, getUser];
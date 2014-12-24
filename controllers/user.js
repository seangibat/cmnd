// Load required packages
var User = require('../models/user');
var Application = require('../models/application');

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save(function(err) {
    if (err) res.send(err);

    res.json({ message: 'New user added.' });
  });
};

// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err)
      res.send(err);

    res.json(users);
  });
};

exports.postUsersApplications = function(req, res) {
  if (req.user._id != req.params.user_id) return res.json({ message: "Cannot add appliation to other users." });
  Application.findOne({ _id: req.body.application_id }, function(err, app){
    if (err) return res.send(err);
    req.user.applications.push(app.command);
    req.user.save(function(err){
      if (err) res.json({ message: 'Error adding application. '});
      res.json({ message: 'Application added.', data: req.user });
    });
  });
}

exports.getUsersApplications = function(req, res) {
  User.findOne({ _id: req.params.user_id }, function(err, user){
    if (err) res.send(err);
    res.send(user.applications);
  });
}
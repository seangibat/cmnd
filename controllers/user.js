// Load required packages
var User = require('../models/user');
var Application = require('../models/application');

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  });

  user.save(function(err) {
    if (err) res.send(err);

    res.redirect('/dashboard');
  });
};

// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err) res.send(err);
    res.json(users);
  });
};

exports.postUsersApplications = function(req, res) {
  Application.findOne({ command_word: req.body.command_word }, function(err, app){
    if (err) return res.send(err);
    if (!app) return res.send({ message: "Application not found." });
    req.user.applications.push(app.command_word);
    req.user.save(function(err){
      if (err) res.json({ message: 'Error adding application. '});
      res.json({ message: 'Application added.', data: req.user });
    });
  });
}

exports.getUsersApplications = function(req, res) {
  var apps = [];
  var processApplcations = function(app){
    apps.push(app);
    if (apps.length == req.user.applications.length) {
      res.json(apps);
    }
  };

  req.user.applications.forEach(function(app){
    Application.findOne({ command_word: app }, function(err, app) {
      if (err) res.send(err);
      processApplcations(app);
    });
  });
}

exports.getUsersApplicationsWithConfig = function(req, res) {
  var apps = [];
  var processApplcations = function(app){
    try {
      var handler = require('../applications/' + app.command_word + '/app.js');
      var data = {
        user: {
          _id: req.user._id
        },
        postPath: 'http://localhost:3001/api/applications/' + app.command_word + '/redirect'
      };
      handler.configPage(data,function(configHtml){
        app = app.toObject();
        app.configHtml = configHtml;
        app.postPath = 
        apps.push(app);
        if (apps.length == req.user.applications.length) {
          res.json(apps);
        }
      });
    }
    catch(err) {
      console.log("Problem getting app handler.", err);
    }
  };

  req.user.applications.forEach(function(app){
    Application.findOne({ command_word: app }, function(err, app) {
      if (err) res.send(err);
      processApplcations(app);
    });
  });
}
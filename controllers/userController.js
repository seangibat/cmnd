// Load required packages
var User = require('../models/userModel');
var Plugin = require('../models/pluginModel');

// POST /api/users
exports.postUsers = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save(function(err) {
    if (err) return res.send(err);
    res.redirect('/dashboard');
  });
};

// GET /api/users
exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err) res.send(err);
    res.json(users);
  });
};

exports.postUsersPlugins = function(req, res) {
  Plugin.findOne({ command_word: req.body.command_word }, function(err, plugin){
    if (err) return res.send(err);
    if (!app) return res.send({ message: "Plugin not found." });
    req.user.plugins.push(plugin.command_word);
    req.user.save(function(err){
      if (err) res.json({ message: 'Error adding plugin. '});
      res.json({ message: plugin.command_word + 'plugin added.' });
    });
  });
}

exports.getUsersPlugins = function(req, res) {
  var plugins = [];
  var processPlugins = function(plugin){
    plugins.push(plugin);
    if (plugins.length == req.user.plugins.length) {
      res.json(plugins);
    }
  };

  req.user.plugins.forEach(function(plugin){
    Plugin.findOne({ command_word: plugin }, function(err, plugin) {
      if (err) res.send(err);
      processPlugins(plugin);
    });
  });
}
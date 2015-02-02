var jailed = require('jailed');
var FuzzySet = require('fuzzyset.js');
var Command = require('../models/commandModel');
var Plugin = require('../models/pluginModel');


exports.postCommands = function(req,res){
  var contains = req.user.applications.some(function(item){ return item === req.body.command_word });
  if (!contains) {
    var set = FuzzySet(req.user.applications);
    contains = set.get(req.body.command_word);
    if (!contains) return res.json({ message: "User has not added application." });
    req.body.command_word = contains[0][1];;
  } 

  var command = new Command();
  command.application = req.body.command_word;
  command.message = req.body.message;
  command.user_id = req.user._id;
  command.save(function(err){
    if (err) return res.send(err);
    try {
      var handler = require('../applications/' + command.application + '/app.js');
      handler.command(command, res);
    }
    catch(error) {
      res.json({message: "There was a problem with the application."});
    }
  });
};

exports.config = function(req,res){
  Plugin.findOne({ command_word: req.params.command_word }, function(err, app){
    if (err) return res.send(err);
    if (!app) return res.json("Application not found");
    var handler = require('../applications/' + req.params.command_word + '/app.js');
    var data = {
      user: {
        _id: req.user._id
      }
    };
    handler.config(data,res.send);
  });
};

exports.getRedirect = function(req,res){
  Plugin.findOne({ command_word: req.params.command_word }, function(err, app){
    if (err) return res.send(err);
    if (!app) return res.json("Application not found");
    var handler = require('../applications/' + req.params.command_word + '/app.js');
    var data = {
      params: req.params,
      user: {
        _id: req.user._id
      }
    };
    handler.getRedirect(data,res);
  });
};

exports.postRedirect = function(req,res){
  Plugin.findOne({ command_word: req.params.command_word }, function(err, app){
    if (err) return res.send(err);
    if (!app) return res.json("Application not found");
    var handler = require('../applications/' + req.params.command_word + '/app.js');
    var data = {
      body: req.body,
      user: {
        _id: req.user._id
      }
    };
    handler.postRedirect(data,res);
  });
};
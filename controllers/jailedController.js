var jailed = require('jailed');
var FuzzySet = require('fuzzyset.js');
var Command = require('../models/commandModel');
var Plugin = require('../models/pluginModel');
var request = require('request');
var storage = require('node-persist');


var pluginStorage = function(app) {
  return function(data){
    if (data !== null || data !== undefined) storage.setItem(app, data);
    else storage.getItem(app);
  }
}

var runPlugin = function(plugin, type, message){
  if (err) return res.send(err);

  var path = '../applications/' + plugin + '/' + type + '.js';
  var api = {
    request    : request,
    response   : res.end,
    getCommand : getCommand,
    storage    : pluginStorage(plugin),
    userId     : req.user._id
  }
  var plugin = new jailed.Plugin(path, api);

  plugin.whenConnected(function(){
    setTimeout(function(){
      if (!res.finished) {
        res.end({
          message: "No response from the plugin."
        });
      }
      plugin.disconnect();
    },2000);
  });
};

exports.postCommands = function(req,res){

  var contains = function(){
    return req.user.applications.some(function(item){ 
      return item === req.body.command_word 
    });
  };

  var fuzzyMatch = function(){
    var set = FuzzySet(req.user.applications);
    contains = set.get(req.body.command_word);
    if (!contains) return res.json({ 
      message: "User has not added application." 
    });
    req.body.command_word = contains[0][1];
  };

  if (!contains()) {
    fuzzyMatch();
  } 
  var makeCommand = function(cb){
    var command = new Command();
    command.plugin = req.body.command_word;
    command.message = req.body.message;
    command.user_id = req.user._id;
    command.save(cb);
  };

  makeCommand(function(cmd){
    runPlugin(cmd.plugin, 'command', cmd.message)
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
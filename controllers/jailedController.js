var jailed = require('jailed');
var FuzzySet = require('fuzzyset.js');
var Command = require('../models/commandModel');
var Plugin = require('../models/pluginModel');
var request = require('request');
var storage = require('node-persist');
var ejs = require('ejs');

var api = {
  log        : console.log,
  setStorage : pluginStorage(command.plugin).set,
  getStorage : pluginStorage(command.plugin).get,
  request    : request,
  res        : function(resp){
    res.json(resp);
  }
}

var pluginStorage = function(app) {
  return {
    get: function(cb){
      if (typeof cb === "function") cb(storage.getItem(app));
    },
    set: function(data){
      storage.setItem(app, data);
    }
  }
}

var contains = function(plugins, plugin){
  return plugins.some(function(item){ 
    return item === plugin;
  });
};

exports.postCommands = function(req,res){

  var fuzzyMatch = function(){
    var set = FuzzySet(req.user.applications);
    contains = set.get(req.body.command_word);
    if (!contains) return null;
    return contains[0][1];
  };

  var makeCommand = function(cb){
    var command = new Command();
    command.plugin = req.body.command_word;
    command.message = req.body.message;
    command.user_id = req.user._id;
    command.save(cb);
  };

  var runPlugin = function(command){
    var path = "/plugins/" + command.plugin + ".js";

    var plugin = new jailed.Plugin(path, api);

    plugin.whenDisconnected(function(){
      if (!res.finished) res.json({ message: "Plugin crashed."})
    });

    plugin.whenConnected(function() {
      plugin.remote.command(command.toObject());

      setTimeout(function(){
        plugin.disconnect();
        if (!res.finished) res.end({ message: "The plugin did not respond."});
      }, 2000);
    }); 
  }

  if (!contains(req.user.applications, req.body.command_word)) req.body.command_word = fuzzyMatch(); 
  if (!req.body.command_word) return res.json({ message: "User has no such application. "});

  makeCommand(function(cmd){
    runPlugin(cmd);
  });
};

exports.config = function(req,res){

  Plugin.findOne({ command_word: req.params.command_word }, function(err, app){
    if (err) return res.send(err);
    if (!app) return res.json("Plugin not found");

    var api = {
      log        : console.log,
      setStorage : pluginStorage(command.plugin).set,
      getStorage : pluginStorage(command.plugin).get,
      request    : request,
      render     : ejs.render,
      res        : function(resp){
        res.send(resp);
      }
    };

    fs.readFile("/plugins/" + plugin.command_word + ".ejs", function(err, template){
      if (err) return res.send("Plugin config not found.");

      var data = {
        redirectPath: "https://cmnd.center/api/" + plugin.command_word + "/redirect"
      }

      var path = "/plugins/" + command.plugin + ".js";
      var plugin = new jailed.Plugin(path, api);
      var data = {
        template: template,
        user: {
          _id: req.user._id
        }
      };

      plugin.whenDisconnected(function(){
        if (!res.finished) res.send({ message: "Plugin crashed."})
      });

      plugin.whenConnected(function() {
        plugin.remote.config(data);

        setTimeout(function(){
          plugin.disconnect();
          if (!res.finished) res.end("The plugin did not respond.");
        }, 2000);
      }); 
    });
  });
};

exports.getRedirect = function(req,res){
  Plugin.findOne({ command_word: req.params.command_word }, function(err, app){
    if (err) return res.send(err);
    if (!app) return res.json("Plugin not found");

    var api = {
      log        : console.log,
      setStorage : pluginStorage(command.plugin).set,
      getStorage : pluginStorage(command.plugin).get,
      request    : request,
      res        : function(resp){
        res.send(resp);
      }
    };
    var path = "/plugins/" + command.plugin + ".js";
    var plugin = new jailed.Plugin(path, api);
    var data = {
      params: req.params,
      user: {
        _id: req.user._id
      }
    };

    plugin.whenDisconnected(function(){
      if (!res.finished) res.json({ message: "Plugin crashed."})
    });

    plugin.whenConnected(function() {
      plugin.remote.getRedirect(data);

      setTimeout(function(){
        plugin.disconnect();
        if (!res.finished) res.end("The plugin did not respond.");
      }, 2000);
    }); 
  });
};

exports.postRedirect = function(req,res){

  Plugin.findOne({ command_word: req.params.command_word }, function(err, app){
    if (err) return res.send(err);
    if (!app) return res.json("Application not found");

    var api = {
      log        : console.log,
      setStorage : pluginStorage(command.plugin).set,
      getStorage : pluginStorage(command.plugin).get,
      request    : request,
      res        : function(resp){
        res.send(resp);
      }
    };
    var path = "/plugins/" + command.plugin + ".js";
    var plugin = new jailed.Plugin(path, api);
    var data = {
      body: req.body,
      user: {
        _id: req.user._id
      }
    };

    plugin.whenDisconnected(function(){
      if (!res.finished) res.json({ message: "Plugin crashed."})
    });

    plugin.whenConnected(function() {
      plugin.remote.postRedirect(data);

      setTimeout(function(){
        plugin.disconnect();
        if (!res.finished) res.end("The plugin did not respond.");
      }, 2000);
    }); 
  });
};
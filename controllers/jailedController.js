var jailed = require('jailed');
var FuzzySet = require('fuzzyset.js');
var Command = require('../models/commandModel');
var Plugin = require('../models/pluginModel');
var request = require('request');
var storage = require('node-persist');
var ejs = require('ejs');

var generateApi = function(plugin, res, userId) {
  return {
    log        : console.log,
    setStorage : pluginStorage(plugin+userId).set,
    getStorage : pluginStorage(plugin+userId).get,
    request    : request,
    res        : function(resp){ res.json(resp); }
  };
}

var pluginStorage = function(uid) {
  return {
    get: function(cb){
      if (typeof cb === "function") cb(storage.getItem(uid));
    },
    set: function(data){
      storage.setItem(uid, data);
    }
  };
}

var contains = function(plugins, plugin){
  return plugins.some(function(item){ 
    return item === plugin;
  });
};

var makePlugin = function(source, api, cb){
  var jailedPlugin = new jailed.DynamicPlugin(source, api);

  jailedPlugin.whenDisconnected(function(){
    if (!res.finished) res.send("Plugin crashed.")
  });

  jailedPlugin.whenConnected(function() {
    setTimeout(function(){
      jailedPlugin.disconnect();
      if (!res.finished) res.send("The plugin did not respond.");
    }, 2000);
    cb(jailedPlugin);
  }); 
}

exports.postCommands = function(req,res){

  var fuzzyMatch = function(plugins, command){
    var set = FuzzySet(plugins);
    var foundMatch = set.get(command);
    if (!foundMatch) return null;
    return foundMatch[0][1];
  };

  var makeCommand = function(cb){
    var command = new Command();
    command.plugin = req.body.command_word;
    command.message = req.body.message;
    command.user_id = req.user._id;
    command.save(cb);
  };

  if (!contains(req.user.applications, req.body.command_word)){
    req.body.command_word = fuzzyMatch(req.user.applications, req.body.command_word); 
  }

  if (!req.body.command_word) {
    return res.json({ message: "User has no such application. "});
  }

  makeCommand(function(command){
    Plugin.findOne({ command_word: command.plugin }, function(err, plugin){

      var api = generateApi(command.plugin, res, req.user._id);

      runPlugin(plugin.source, api, function(jailedPlugin){
        jailedPlugin.remote.command({ 
          command: command.toObject(),
          secrets: JSON.parse(plugin.secrets)
        });
      });

    });
  });
};

exports.config = function(req,res){
  Plugin.findOne({ command_word: req.params.command_word }, function(err, plugin){
    if (err) return res.send(err);
    if (!app) return res.json("Plugin not found");
    var data = storage.getItem(plugin.command_word + req.user._id);
    data.redirectUrl = "/plugins/" + plugin.command_word + "/redirect";
    data.secrets = JSON.parse(plugin.secrets);
    var html = ejs.render(plugin.configHtml, data);
    res.send(html);
  });
};

exports.getRedirect = function(req,res){
  Plugin.findOne({ command_word: req.params.command_word }, function(err, plugin){
    if (err) return res.send(err);
    if (!app) return res.json("Plugin not found");

    var api = generateApi(plugin.command_word, res, req.user._id);

    runPlugin(plugin.source, api, function(jailedPlugin){
      jailedPlugin.remote.getRedirect({
        params: req.params,
        secrets: JSON.parse(plugin.secrets)
      });
    });

  });
};

exports.postRedirect = function(req,res){
  Plugin.findOne({ command_word: req.params.command_word }, function(err, plugin){
    if (err) return res.send(err);
    if (!app) return res.json("Plugin not found");

    var api = generateApi(plugin.command_word, res, req.user._id);

    runPlugin(plugin.source, api, function(jailedPlugin){
      jailedPlugin.remote.postRedirect({
        body: req.body,
        secrets: JSON.parse(plugin.secrets)
      });
    });

  });
};
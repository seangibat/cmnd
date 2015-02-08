var Plugin = require('../models/pluginModel');

exports.getPlugins = function(req,res){
  Plugin.find(function(err, plugins) {
    if (err) res.send(err);
    res.json(plugins);
  });
};

exports.getPluginsNotAdded = function(req,res){
  Plugin.find(function(err, plugins) {
    if (err) res.send(err);
    var filteredPlugins = plugins.filter(function(plugin){
      return req.user.applications.indexOf(plugin.command_word) == -1;
    });
    res.json(filteredPlugins);
  });
};

exports.getPlugin = function(req,res){
  Plugin.findOne({ command_word: req.params.command_word }, function(err, plugin) {
    if (err) res.send(err);
    res.json(plugin);
  });
};

exports.postPlugins = function(req,res){
  var plugin = new Plugin();

  plugin.title = req.body.title;
  plugin.description = req.body.description;
  plugin.command_word = req.body.command_word;
  plugin.user_id = req.user._id;

  plugin.save(function(err){
    if (err) res.send(err);
    res.json({ message: 'Plugin added.', data: plugin });
  });
};
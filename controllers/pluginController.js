var Plugin = require('../models/pluginModel');

exports.getPlugins = function(req,res){
  Plugin.find(function(err, plugins) {
    if (err) res.send(err);
    res.json(plugins);
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
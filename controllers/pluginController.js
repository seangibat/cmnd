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
  plugin.source = req.body.source;
  plugin.config_html = req.body.config_html;
  plugin.secrets = req.body.secrets;

  console.log(plugin);

  plugin.save(function(err){
    if (err) res.send(err);
    res.end("Plugin added.");
  });
};

exports.putPlugins = function(req,res){
  Plugin.findOne({ command_word: req.params.plugin }, function(err, plugin){
   plugin.title = req.body.title;
   plugin.description = req.body.description;
   plugin.command_word = req.body.command_word;
   plugin.source = req.body.source;
   plugin.config_html = req.body.config_html;
   plugin.secrets = req.body.secrets;

   plugin.save(function(err){
     if (err) res.send(err);
     res.send("Plugin updated.");
   }); 
  });
};
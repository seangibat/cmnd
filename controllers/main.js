var Command = require('../models/command');
var Application = require('../models/application'); 

exports.home = function(req,res){
  res.render("index");
};

exports.dashboard = function(req,res){
  Command.find({ user_id: req.user._id }, function(err, commands){
    if (err) commands = [];
    res.render("dashboard", {commands: commands});
  });
};


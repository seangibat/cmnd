var Command = require('../models/commandModel');

exports.getCommands = function(req,res){
  Command.find({ user_id: req.user._id }, function(err,commands){
    if (err) res.send(err);
    res.json(commands);
  });
};

exports.getCommand = function(req,res){
  Command.findById({ user_id: req.user._id, _id: req.params.command_id }, function(err, command){
    if (err) res.send(err);
    res.json(command);
  });
};
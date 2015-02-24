var Command = require('../models/commandModel');

exports.getCommands = function(req,res){
  Command.find({ user_id: req.user._id }, function(err,commands){
    if (err) res.send(err);
    res.json(commands);
  });
};
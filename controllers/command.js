var Command = require('../models/command');

exports.postCommands = function(req,res){
  var contains = req.user.applications.some(function(item){ return item === req.body.application });
  if (!contains) return res.json({ message: "User has not added application." });

  var command = new Command();
  command.application = req.body.application;
  command.message = req.body.message;
  command.userId = req.user._id;
  command.save(function(err){
    if (err) return res.send(err);
    var handler = require('../applications/' + command.application + '/app.js');
    handler.command(command, res);
  });
};

exports.getCommands = function(req,res){
  Command.find({ userId: req.user._id }, function(err,commands){
    if (err) res.send(err);

    res.json(commands);
  });
};

exports.getCommand = function(req,res){
  Command.findById({ userId: req.user._id, _id: req.params.command_id }, function(err, command){
    if (err) res.send(err);

    res.json(command);
  });
};
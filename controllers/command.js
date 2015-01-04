var Command = require('../models/command');

exports.postCommands = function(req,res){
  var contains = req.user.applications.some(function(item){ return item === req.body.command_word });
  if (!contains) return res.json({ message: "User has not added application." });

  var command = new Command();
  command.application = req.body.command_word;
  command.message = req.body.message;
  command.user_id = req.user._id;
  command.save(function(err){
    if (err) return res.send(err);
    try {
      var handler = require('../applications/' + command.application + '/app.js');
      handler.command(command, res);
    }
    catch(error) {
      res.json({message: "There was a problem with the application."});
    }
  });
};

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
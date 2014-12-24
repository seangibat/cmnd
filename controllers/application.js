var Application = require('../models/application');

exports.getRedirect = function(req,res){
  Application.findOne({ command: req.params.command_word }, function(err, app){
    if (err) return res.send(err);
    if (!app) return res.json("Application not found");
    var handler = require('../applications/' + req.params.command_word + '/app.js');
    var data = {
      params: req.params,
      user: {
        _id: req.user._id
      }
    };
    handler.getRedirect(data,res);
  });
};

exports.postRedirect = function(req,res){
  Application.findOne({ command: req.params.command_word }, function(err, app){
    if (err) return res.send(err);
    if (!app) return res.json("Application not found");
    var handler = require('../applications/' + req.params.command_word + '/app.js');
    var data = {
      body: req.body,
      user: {
        _id: req.user._id
      }
    };
    handler.postRedirect(data,res);
  });
};

exports.getApplications = function(req,res){
  Application.find(function(err, apps) {
    if (err) res.send(err);
    res.json(apps);
  });
};

exports.getApplication = function(req,res){
  Application.findOne({ command: req.params.command_word }, function(err, app) {
    if (err) res.send(err);
    res.json(app);
  });
};

exports.postApplications = function(req,res){
  var app = new Application();

  app.name = req.body.name;
  app.description = req.body.description;
  app.command = req.body.command;
  app.userId = req.user._id;

  app.save(function(err){
    if (err) res.send(err);
    res.json({ message: 'Applcation added.', data: app });
  });
};
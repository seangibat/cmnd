var Command = require('../models/commandModel');

exports.index = function(req,res){
  res.render("index");
};

exports.dashboard = function(req,res){
  res.send("dashboard");
};
var Command = require('../models/commandModel');

exports.index = function(req,res){
  console.log("Index.");
  res.render("index");
};

exports.dashboard = function(req,res){
  console.log("Dashboard..");
  res.render("dashboard");
};

exports.logout = function(req,res){
  console.log("Logout");
  req.session.destroy();
  res.redirect('/');
};

exports.login = function(req,res){
  console.log("Logging in...");
  res.redirect('/dashboard');
};
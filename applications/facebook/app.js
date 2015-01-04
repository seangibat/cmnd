var ejs = require('ejs');
var FacebookConfig = require('./facebookModel.js');
var request = require('request');
var parseArgs = require('minimist');
var fs = require('fs')
var FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;

var dir = __dirname;

exports.command = function(command,res){
  FacebookConfig.findOne({ user_id: command.user_id }, function(err, facebookConfig){
    if (!facebookConfig) return res.json({message: "You have not authenticated this plugin yet."});
    request.post('https://graph.facebook.com/me/feed?message=' + command.message + '&access_token=' + facebookConfig.token, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.json(body);
      }
      else {
        res.json({message: "The facebook server could not be contacted."});
      }
    });
  });
};

exports.getRedirect = function(req,res){
  res.send("No get request.");
};

exports.postRedirect = function(req,res){
  var url = "https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=1617204075174751&client_secret=" + FACEBOOK_CLIENT_SECRET + "&fb_exchange_token=" + req.body.accessToken;
  FacebookConfig.findOne({ user_id: req.user._id }, function(err, facebookConfig){
    if (err) return res.json({message: "Error getting FB config from DB."});
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        if (facebookConfig) {
          facebookConfig.token = body.substr(13,228);
        }
        else {
          facebookConfig = new FacebookConfig({
            user_id: req.user._id,
            token: body.substr(13,228)
          });
        }
        facebookConfig.save(function(err){
          if (err) return res.json({message: "Access token could not be saved in DB."});
          res.json({message: "Access token saved."});
        });
      }
      else {
        res.json({message: "Access token could not be retrieved from Facebook."});
      }
    });
  });
};

exports.configPage = function(data,callback){
  fs.readFile(dir + '/config.ejs', 'utf8', function (err,template) {
    if (err) return console.log(err);
    callback(ejs.render(template, data));
  });
};
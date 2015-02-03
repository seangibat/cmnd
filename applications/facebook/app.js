var ejs = require('ejs');
var FacebookConfig = require('./facebookModel.js');

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

exports.postRedirect = 

exports.configPage = function(data,callback){
  fs.readFile(dir + '/config.ejs', 'utf8', function (err,template) {
    if (err) return console.log(err);
    callback(ejs.render(template, data));
  });
};
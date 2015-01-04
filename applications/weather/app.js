var ejs = require('ejs');
var Weather = require('./weatherModel.js');
var request = require('request');
var parseArgs = require('minimist');
var fs = require('fs');
var WUNDERGROUND_API_KEY = process.env.WUNDERGROUND_API_KEY;

var dir = __dirname;

exports.command = function(command,res){
  Weather.findOne({ user_id: command.user_id }, function(err, weatherConfig){
    request('http://api.wunderground.com/api/'+ WUNDERGROUND_API_KEY +'/conditions/q/CA/San_Francisco.json', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        args = parseArgs(command.message);
        zipcode = args.z || (weatherConfig) ? weatherConfig.zipcode : null;
        if (!zipcode) return res.json({ message: "No zipcode specified, no default zipcode."});
        body = JSON.parse(body);
        var result = {};       
        result.location = body.current_observation.display_location.full;
        result.temperature = body.current_observation.temp_f;
        res.json(result);
      }
      else {
        res.json({message: "The weather server could not be contacted."});
      }
    });
  });
};

exports.getRedirect = function(req,res){
  res.send("No get request.");
};

exports.postRedirect = function(req,res){
  if (!(/\b\d{5}\b/.test(req.body.zipcode))) {
    return res.send("Invalid zipcode.");
  }
  Weather.findOne({ user_id: req.user._id }, function(err, weather){
    if (err) return res.send(err);
    if (weather){
      weather.zipcode = req.body.zipcode;
    }
    else {
      var weather = new Weather({
        zipcode: req.body.zipcode,
        user_id: req.user._id
      });
    }
    weather.save(function(err){
      res.json({ message: "Zipcode updated." });
    });
  });
};

exports.configPage = function(data,callback){
  fs.readFile(dir + '/config.ejs', 'utf8', function (err,template) {
    if (err) {
      return console.log(err);
    }
    callback(ejs.render(template, data));
  });
};
Weather.findOne({ user_id: command.user_id }, function(err, weatherConfig){
  zipcode = (/\b\d{5}\b/.test(command.message)) ? command.message : (weatherConfig) ? weatherConfig.zipcode : null;
  if (!zipcode) return res.json({ message: "No zipcode specified, no default zipcode."});
  request('http://api.wunderground.com/api/'+ WUNDERGROUND_API_KEY +'/conditions/q/CA/' + zipcode + '.json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
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

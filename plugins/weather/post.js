function(req,res){
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
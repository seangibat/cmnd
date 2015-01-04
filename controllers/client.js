var Client = require('../models/client');

exports.postClients = function(req,res) {
  var client = new Client();

  client.name = req.body.name;
  client.secret = uid(24);
  client.user_id = req.user._id;

  client.save(function(err){
    if (err) res.send(err);

    res.json({ message: 'Client registered. Please save your id (not _id) and secret.', data: client });
  });
};

exports.getClients = function(req, res) {
  Client.find({ user_id: req.user._id }, function(err, clients) {
    if (err) res.send(err);

    res.json(clients);
  });
};


function uid (len) {
  var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};
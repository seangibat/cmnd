var oauth2orize = require('oauth2orize');
var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');
var Code = require('../models/code');

var server = oauth2orize.createServer();

server.serializeClient(function(client, callback){
  return callback(null, client._id);
});

server.deserializeClient(function(id, callback){
  Client.findOne({ _id: id }, function(err, client) {
    if (err) return callback(err);
    return callback(null, client);
  });
});

server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, callback){
  var code = new Code({
    value: uid(16),
    client_id: client._id,
    redirect_uri: redirect_uri,
    user_id: user._id
  });

  code.save(function(err){
    if (err) return callback(err);
    callback(null, code.value);
  });
}));

server.exchange(oauth2orize.exchange.code(function(client, code, redirectUri, callback){
  Code.findOne({ value: code }, function (err, authCode) {
    if (err) return callback(err);
    if (authCode === undefined) return callback(null, false);
    if (client._id.toString() !== authCode.client_id) return callback(null, false);
    if (redirectUri !== authCode.redirect_uri) return callback(null, false);

    authCode.remove(function(err){
      if(err) return callback(err);

      var token = new Token({
        value: uid(256),
        client_id: authCode.client_id,
        user_id: authCode.user_id
      });

      token.save(function(err){
        if (err) return callback(err);

        callback(null, token);
      });
    });
  });
}));

exports.signIn = function(req, res){
  console.log(req.params);
  Client.find({_id: req.params.client_id }, function(err, client){
    if (!client) return res.json({ message: 'No such client' });
    Token.findOne({ user_id: req.user._id, client_id: req.params.client_id }, function(err, token){
      console.log(err, token);
      if (token) return res.json(token);
      var token = new Token({
        value: uid(256),
        client_id: req.params.client_id,
        user_id: req.user._id
      });
      token.save(function(err){
        res.json(token);
      });
    });
  });
};

exports.authorization = [
  server.authorization(function(clientId, redirectUri, callback){
    Client.findOne({ id: clientId }, function(err,client){
      if (err) return callback(err);
      return callback(null, client, redirectUri);
    });
  }),
  function(req,res){
    res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
  }
];

exports.decision = [
  server.decision()
];

exports.token = [
  server.token(),
  server.errorHandler()
]

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



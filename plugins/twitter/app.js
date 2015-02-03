exports.command = function(command,res){
  res.json({message: command.message + " twitta?!"});
};

exports.getRedirect = function(data,res){
  res.send("Heyyy");
};

exports.postRedirect = function(data, res){
  res.send("Hello!");
};

exports.configPage = function(data, callback){
  callback("sup");
};
exports.command = function(command,res){
  res.send(command.message);
};

exports.getRedirect = function(data,res){
  res.send("Heyyy");
};

exports.postRedirect = function(data, res){
  res.send("Hello!");
};

exports.configPage = function(data, res){

};
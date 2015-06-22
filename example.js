var setStorage = application.remote.setStorage; // setStorage("key", value);
var getStorage = application.remote.getStorage; // getStorage("key");
var request    = application.remote.request; // npm module request
var send       = application.remote.send; // res(someObject) sends the whatever response
var res        = application.remote.res; // res(someObject) sends the json response
var log        = application.remote.log; // log("stuff I want to log");

var command = function(command, secrets){
  res.json({ message: "Hey!" });
};

var getRedirect = function(params, secrets){
  res.send("get heyy");
};

var postRedirect = function(body, secrets){
  res.send("yoo post");
};

var api = {
  command      : command,
  getRedirect  : getRedirect,
  postRedirect : postRedirect
};

application.setInterface(api);
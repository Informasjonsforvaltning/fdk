//var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
//var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'


var sys = require("sys"),
  my_http = require("http");
my_http.createServer(function(request,response){
  sys.puts("I got kicked");
  response.writeHeader(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}).listen(8080);
sys.puts("Server Running on 8080");

//server.listen(server_port, server_ip_address, function () {
//  console.log( "Listening on " + server_ip_address + ", port " + server_port )
//});

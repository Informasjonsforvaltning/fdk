//var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
//var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'


var connect = require('connect');
var serveStatic = require('serve-static');

connect().use(serveStatic(__dirname)).listen(8080, function(){
  console.log('Server running on 8080...');
});

//server.listen(server_port, server_ip_address, function () {
//  console.log( "Listening on " + server_ip_address + ", port " + server_port )
//});

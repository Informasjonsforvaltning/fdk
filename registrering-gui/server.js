var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'


var express = require('express'),
  fs      = require('fs'),
  app     = express(),
  eps     = require('ejs'),
  morgan  = require('morgan');

Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/src/index.html');
});


// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});


app.listen(server_port, server_ip_address);
console.log('Server running on http://%s:%s', server_ip_address, server_port);

module.exports = app ;

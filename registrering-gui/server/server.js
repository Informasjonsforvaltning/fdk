var path = require("path");
var express = require("express");
var ejs = require("ejs");
var bodyParser = require("body-parser")
var methodOverride = require("method-override")
var compression = require("compression")

module.exports = {
  start: function(prodMode) {

    var env = {
      production: process.env.NODE_ENV === 'production'
    };

    var express = require('express');
    var app = express();
    app.use(compression())
    app.set('view engine', 'html');
    app.engine('html', ejs.renderFile);
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(methodOverride())

    var port = Number(process.env.PORT || 3000);

    app.get('/', function(req, res) {
      res.render('../dist/index.html', {
        regApiUrl: process.env.REG_API_URL,
      });
    });
    app.use(express.static(path.join(__dirname, '/../dist')));

    app.listen(port, function () {
      console.log('server running at localhost:3000, go refresh and see magic');
    });
  }
}

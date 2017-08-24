var express = require('express');
var app = express();

var port = 3010;

function setupExpress () {
  app.use('/static', express.static('./dist/static'));
}

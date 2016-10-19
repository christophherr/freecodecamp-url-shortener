var express = require('express');
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');

var app = express();

var mongoPath = process.env.MONGOLAB_URI || "mongodb://localhost:27017/"

app.set('port', process.env.PORT);

mongoose.connect(mongoPath);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


app.listen(app.get('port'), function() {
  console.log('Node.js Server is listening on port ' + app.get('port'));
  });
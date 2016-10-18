var express = require('express');


var app = express();

app.set('port', process.env.PORT);



app.listen(app.get('port'), function() {
  console.log('Node.js Server is listening on port ' + app.get('port'));
  });
var express = require('express');
var app = express();

app.use(express.static(__dirname));
console.log('Start hosting from ' + __dirname);

app.listen(process.env.port || 4000);
console.log('Listening to port ' + (process.env.port || 4000));

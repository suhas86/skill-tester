var express = require('express');
var app = express();
//Calling mongoose module
var mongoose = require('mongoose');
var logger = require('morgan');
// path is used the get the path of our files on the computer
var path = require('path');
// module for maintaining sessions
//var session = require('express-session');

app.use(logger('dev'));

var bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));


mongoose.connect('mongodb://localhost/skill-tester');

var db = mongoose.connection;
db.on('error', console.error.bind(console, '#MongoDB - connection error'));

//fs module, by default module for file management 
var fs = require('fs');

//public folder as static
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})


//Include all our models
fs.readdirSync('./app/models').forEach(function (file) {
    //Check if file is JS format
    if (file.indexOf('.js')) {
        require('./app/models/' + file);
    }
}); //End For Each

//Include Controllers
fs.readdirSync('./app/controllers').forEach(function (file) {
    if (file.indexOf('.js')) {
        //Include a file as a route variable
        var route = require('./app/controllers/' + file);
        //Call Controller function of each file and pass
        //your app instance to it
        route.controller(app);
    }
}); //End For Each

var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log("App running on port " + port);
})
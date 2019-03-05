// server.js

// modules =================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var cors = require('cors');
var http = require('http').Server(app);
var io  = require('socket.io')(http);
// configuration ===========================================
global.io = io;

// set our port
var port = process.env.PORT || 8080;


// get all data/stuff of the body (POST) parameters
// parse application/json 
//app.use(bodyParser.json());

app.use(bodyParser.json({ limit: '10mb' }));

// parse application/vnd.api+json as json
app.use(bodyParser.json({type: 'application/vnd.api+json', limit: '10mb'}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true, limit: '10mb' }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// routes ==================================================
//require('./app/routes')(app); // configure our routes

// CORS
app.use(cors());

// Use the passport package in our application
require(__dirname + '/src/config/passport')(passport);
app.use(passport.initialize());

//Set up the api endpoints
require(__dirname + '/src/services/index').init(express, app);

// --- Sequelize ---
require(__dirname + '/src/models/index');

global.clients = {};
io.on('connection', function(socket){

    socket.on('join', function (id) {
        socket.name = id;
        console.log(socket.name + ' joined!');
        clients[id] = socket;
    });

    socket.on('subscribe', function (group) {
        console.log(socket.name + ' subscribed to group: '+ group.group);
        socket.join(group.group);
    });

    socket.on('unsubscribe', function (group) {
        console.log(socket.name + ' unsubscribe from group: '+ group.group);
        socket.leave(group.group);
        socket.disconnect();
    });

    socket.on('deviceTilt', function (deviceOrientation) {
        console.log(socket.name + ' : '+ deviceOrientation.deviceOrientation);
        socket.broadcast.in(deviceOrientation.deviceOrientation.groupID).emit('tilt',deviceOrientation.deviceOrientation);
    });

    socket.on('disconnect', function(){
        console.log( socket.name + ' has disconnected from the chat.' + socket.id);
    });

    socket.on('chat', function (message) {
        console.log(message);
        socket.broadcast.in(message.groupID).emit('new_message', message);
    });
});

// start app ===============================================
// startup our app at http://localhost:8080
http.listen(port);

// shoutout to the user                     
console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = http;